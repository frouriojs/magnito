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
import crypto from 'crypto';
import { challengeMethod } from 'domain/user/model/challengeMethod';
import { userMethod } from 'domain/user/model/userMethod';
import { challengeCommand } from 'domain/user/repository/challengeCommand';
import { challengeQuery } from 'domain/user/repository/challengeQuery';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { genCredentials } from 'domain/user/service/genCredentials';
import { genTokens } from 'domain/user/service/genTokens';
import {
  calculateScramblingParameter,
  calculateSessionKey,
} from 'domain/user/service/srp/calcSessionKey';
import { calculateSignature } from 'domain/user/service/srp/calcSignature';
import { calculateSrpB } from 'domain/user/service/srp/calcSrpB';
import { getPoolName } from 'domain/user/service/srp/util';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
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
      const user = userMethod.createUser({
        name: req.Username,
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
      const user = await userQuery.findByName(tx, req.AuthParameters.USERNAME);
      assert(user.verified);
      const { B, b } = calculateSrpB(user.verifier);
      const secretBlock = crypto.randomBytes(64).toString('base64');

      const challenge = challengeMethod.createChallenge({
        secretBlock,
        pubA: req.AuthParameters.SRP_A,
        pubB: B,
        secB: b,
      });

      await challengeCommand.save(tx, challenge);

      return {
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeParameters: {
          SALT: user.salt,
          SECRET_BLOCK: secretBlock,
          SRP_B: B,
          USERNAME: req.AuthParameters.USERNAME,
          USER_ID_FOR_SRP: req.AuthParameters.USERNAME,
        },
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
      const challenge = await challengeQuery.findBySecretBlock(
        tx,
        req.ChallengeResponses.PASSWORD_CLAIM_SECRET_BLOCK,
      );
      const { pubA: A, pubB: B, secB: b } = challenge;
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const jwks = await userPoolQuery.findJwks(tx, user.userPoolId);

      assert(pool.id === poolClient.userPoolId);

      const poolname = getPoolName(pool.id);
      const scramblingParameter = calculateScramblingParameter(A, B);
      const sessionKey = calculateSessionKey({ A, B, b, v: user.verifier });

      const signature = calculateSignature({
        poolname,
        username: user.name,
        secretBlock: req.ChallengeResponses.PASSWORD_CLAIM_SECRET_BLOCK,
        timestamp: req.ChallengeResponses.TIMESTAMP,
        scramblingParameter,
        key: sessionKey,
      });
      await challengeCommand.delete(tx, challenge.id);

      assert(signature === req.ChallengeResponses.PASSWORD_CLAIM_SIGNATURE);

      return {
        AuthenticationResult: {
          ...genTokens({
            privateKey: pool.privateKey,
            userPoolClientId: poolClient.id,
            jwks,
            user,
          }),
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
