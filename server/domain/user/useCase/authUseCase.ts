import type {
  ConfirmSignUpTarget,
  GetUserTarget,
  RefreshTokenAuthTarget,
  RespondToAuthChallengeTarget,
  RevokeTokenTarget,
  SignUpTarget,
  UserSrpAuthTarget,
} from 'api/@types/auth';
import assert from 'assert';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { genCredentials } from 'domain/user/service/genCredentials';
import { genTokens } from 'domain/user/service/genTokens';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
import { cognitoAssert } from 'service/cognitoAssert';
import { transaction } from 'service/prismaClient';
import { sendMail } from 'service/sendMail';
import type { AccessTokenJwt } from 'service/types';

export const authUseCase = {
  signUp: (req: SignUpTarget['reqBody']): Promise<SignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const { salt, verifier } = genCredentials({
        poolId: poolClient.userPoolId,
        username: req.Username,
        password: req.Password,
      });
      const idCount = await userQuery.countId(tx, req.Username);
      const user = userMethod.createUser(idCount, {
        name: req.Username,
        password: req.Password,
        email: req.UserAttributes[0].Value,
        salt,
        verifier,
        userPoolId: poolClient.userPoolId,
      });
      await userCommand.save(tx, user);
      await sendMail({
        to: { name: user.name, address: user.email },
        subject: 'Your verification code',
        text: `Your confirmation code is ${user.confirmationCode}`,
      });

      return {
        CodeDeliveryDetails: {
          AttributeName: 'email',
          DeliveryMedium: 'EMAIL',
          Destination: req.UserAttributes[0].Value.replace(/^(.).*@(.).+$/, '$1***@$2***'),
        },
        UserConfirmed: false,
        UserSub: user.id,
      };
    }),
  confirmSignUp: (req: ConfirmSignUpTarget['reqBody']): Promise<ConfirmSignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.Username);
      const verified = userMethod.verifyUser(user, req.ConfirmationCode);

      await userCommand.save(tx, verified);

      return {};
    }),
  userSrpAuth: (req: UserSrpAuthTarget['reqBody']): Promise<UserSrpAuthTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.AuthParameters.USERNAME).catch(() => null);
      cognitoAssert(user, 'Incorrect username or password.');

      const { userWithChallenge, ChallengeParameters } = userMethod.createChallenge(
        user,
        req.AuthParameters,
      );

      await userCommand.save(tx, userWithChallenge);

      return {
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeParameters,
      };
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
          ExpiresIn: 3600,
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
  getUser: (req: GetUserTarget['reqBody']): Promise<GetUserTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      return {
        UserAttributes: [
          { Name: 'sub', Value: user.id },
          { Name: 'email', Value: user.email },
          { Name: 'email_verified', Value: 'true' },
        ],
        Username: user.name,
      };
    }),
  revokeToken: (req: RevokeTokenTarget['reqBody']): Promise<RevokeTokenTarget['resBody']> =>
    transaction(async (tx) => {
      await userQuery.findByRefreshToken(tx, req.Token);

      return {};
    }),
};
