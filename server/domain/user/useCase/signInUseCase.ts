import assert from 'assert';
import type {
  RefreshTokenAuthTarget,
  RespondToAuthChallengeTarget,
  UserSrpAuthTarget,
} from 'common/types/auth';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { genTokens } from 'domain/user/service/genTokens';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { cognitoAssert } from 'service/cognitoAssert';
import { EXPIRES_SEC } from 'service/constants';
import { transaction } from 'service/prismaClient';

export const signInUseCase = {
  userSrpAuth: (req: UserSrpAuthTarget['reqBody']): Promise<UserSrpAuthTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.AuthParameters.USERNAME).catch(() => null);
      cognitoAssert(user, 'Incorrect username or password.');

      const { userWithChallenge, ChallengeParameters } = userMethod.createChallenge(
        user,
        req.AuthParameters,
      );

      await userCommand.save(tx, userWithChallenge);

      return { ChallengeName: 'PASSWORD_VERIFIER', ChallengeParameters };
    }),
  refreshTokenAuth: (
    req: RefreshTokenAuthTarget['reqBody'],
  ): Promise<RefreshTokenAuthTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByRefreshToken(tx, req.AuthParameters.REFRESH_TOKEN);
      const pool = await userPoolQuery.findById(tx, user.userPoolId);
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const jwks = await userPoolQuery.findJwks(tx, user.userPoolId);

      assert(pool.id === poolClient.userPoolId);

      return {
        AuthenticationResult: {
          ...genTokens({
            privateKey: pool.privateKey,
            userPoolClientId: poolClient.id,
            jwks,
            user,
          }),
          ExpiresIn: EXPIRES_SEC,
          TokenType: 'Bearer',
        },
        ChallengeParameters: {},
      };
    }),
  respondToAuthChallenge: (
    req: RespondToAuthChallengeTarget['reqBody'],
  ): Promise<RespondToAuthChallengeTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.ChallengeResponses.USERNAME);
      const pool = await userPoolQuery.findById(tx, user.userPoolId);
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const jwks = await userPoolQuery.findJwks(tx, user.userPoolId);

      assert(pool.id === poolClient.userPoolId);
      assert(user.challenge?.secretBlock === req.ChallengeResponses.PASSWORD_CLAIM_SECRET_BLOCK);

      cognitoAssert(user.verified, 'User is not confirmed.');

      const tokens = userMethod.srpAuth({
        user,
        timestamp: req.ChallengeResponses.TIMESTAMP,
        clientSignature: req.ChallengeResponses.PASSWORD_CLAIM_SIGNATURE,
        jwks,
        pool,
        poolClient,
      });

      return {
        AuthenticationResult: {
          ...tokens,
          ExpiresIn: 3600,
          RefreshToken: user.refreshToken,
          TokenType: 'Bearer',
        },
        ChallengeParameters: {},
      };
    }),
};
