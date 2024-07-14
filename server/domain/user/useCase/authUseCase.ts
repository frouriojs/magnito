/* eslint-disable max-lines */
import assert from 'assert';
import type {
  ChangePasswordTarget,
  ConfirmForgotPasswordTarget,
  ConfirmSignUpTarget,
  ForgotPasswordTarget,
  GetUserTarget,
  ListUserPoolsTarget,
  RefreshTokenAuthTarget,
  ResendConfirmationCodeTarget,
  RespondToAuthChallengeTarget,
  RevokeTokenTarget,
  SignUpTarget,
  UserSrpAuthTarget,
} from 'common/types/auth';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { genTokens } from 'domain/user/service/genTokens';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
import { cognitoAssert } from 'service/cognitoAssert';
import { EXPIRES_SEC } from 'service/constants';
import { transaction } from 'service/prismaClient';
import type { AccessTokenJwt } from 'service/types';
import { genCodeDeliveryDetails } from '../service/genCodeDeliveryDetails';
import { sendConfirmationCode } from '../service/sendConfirmationCode';

export const authUseCase = {
  signUp: (req: SignUpTarget['reqBody']): Promise<SignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const idCount = await userQuery.countId(tx, req.Username);
      const user = userMethod.createUser(idCount, {
        name: req.Username,
        password: req.Password,
        email: req.UserAttributes[0].Value,
        userPoolId: poolClient.userPoolId,
      });
      await userCommand.save(tx, user);
      await sendConfirmationCode(user);

      return {
        CodeDeliveryDetails: genCodeDeliveryDetails(user),
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
  getUser: (req: GetUserTarget['reqBody']): Promise<GetUserTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      return {
        UserAttributes: [
          { Name: 'sub', Value: user.id },
          { Name: 'email', Value: user.email },
          { Name: 'email_verified', Value: user.verified ? 'true' : 'false' },
        ],
        Username: user.name,
      };
    }),
  revokeToken: (req: RevokeTokenTarget['reqBody']): Promise<RevokeTokenTarget['resBody']> =>
    transaction(async (tx) => {
      await userQuery.findByRefreshToken(tx, req.Token);

      return {};
    }),
  resendConfirmationCode: (
    req: ResendConfirmationCodeTarget['reqBody'],
  ): Promise<ResendConfirmationCodeTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const user = await userQuery.findByName(tx, req.Username);

      assert(poolClient.userPoolId === user.userPoolId);

      await sendConfirmationCode(user);

      return { CodeDeliveryDetails: genCodeDeliveryDetails(user) };
    }),
  listUserPools: (req: ListUserPoolsTarget['reqBody']): Promise<ListUserPoolsTarget['resBody']> =>
    transaction(async (tx) => {
      const pools = await userPoolQuery.listAll(tx, req.MaxResults);
      return { UserPools: pools.map((p) => ({ Id: p.id })) };
    }),
  changePassword: (
    req: ChangePasswordTarget['reqBody'],
  ): Promise<ChangePasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      await userCommand.save(tx, userMethod.changePassword({ user, req }));

      return {};
    }),
  forgotPassword: (
    req: ForgotPasswordTarget['reqBody'],
  ): Promise<ForgotPasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const user = await userQuery.findByName(tx, req.Username);
      assert(poolClient.userPoolId === user.userPoolId);

      const forgotUser = userMethod.forgotPassword(user);
      await userCommand.save(tx, forgotUser);
      await sendConfirmationCode(forgotUser);

      return { CodeDeliveryDetails: genCodeDeliveryDetails(forgotUser) };
    }),
  confirmForgotPassword: (
    req: ConfirmForgotPasswordTarget['reqBody'],
  ): Promise<ConfirmForgotPasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.Username);

      await userCommand.save(
        tx,
        userMethod.confirmForgotPassword({
          user,
          confirmationCode: req.ConfirmationCode,
          password: req.Password,
        }),
      );

      return {};
    }),
};
