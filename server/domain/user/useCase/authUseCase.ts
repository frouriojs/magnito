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
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_USER_POOL_ID } from 'service/envValues';
import { transaction } from 'service/prismaClient';
import { sendMail } from 'service/sendMail';
import type { AccessTokenJwt } from 'service/types';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';
import { genCredentials } from '../service/genCredentials';
import { genTokens } from '../service/genTokens';

export const authUseCase = {
  signUp: (req: SignUpTarget['reqBody']): Promise<SignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const { salt, verifier } = genCredentials({
        poolId: DEFAULT_USER_POOL_ID,
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

      return {
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeParameters: {
          SALT: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          SECRET_BLOCK: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          SRP_B: 'ccccccccccccccccccccccccccccccccc',
          USERNAME: req.AuthParameters.USERNAME,
          USER_ID_FOR_SRP: req.AuthParameters.USERNAME,
        },
      };
    }),
  resreshTokenAuth: (
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
