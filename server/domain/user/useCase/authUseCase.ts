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
import { transaction } from 'service/prismaClient';
import { sendMail } from 'service/sendMail';
import type { AccessTokenJwt } from 'service/types';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';
import { userQuery } from '../repository/userQuery';
import { genTokens } from '../service/genTokens';

export const authUseCase = {
  SignUp: (req: SignUpTarget['reqBody']): Promise<SignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const user = userMethod.createUser({
        name: req.Username,
        email: req.UserAttributes[0].Value,
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
  ConfirmSignUp: (req: ConfirmSignUpTarget['reqBody']): Promise<ConfirmSignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.Username);
      const verified = userMethod.verifyUser(user, req.ConfirmationCode);

      await userCommand.save(tx, verified);

      return {};
    }),
  UserSrpAuth: (req: UserSrpAuthTarget['reqBody']): Promise<UserSrpAuthTarget['resBody']> =>
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
  ResreshTokenAuth: (
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
  RespondToAuthChallenge: (
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
  GetUser: (req: GetUserTarget['reqBody']): Promise<GetUserTarget['resBody']> =>
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
  RevokeToken: (req: RevokeTokenTarget['reqBody']): Promise<RevokeTokenTarget['resBody']> =>
    transaction(async (tx) => {
      await userQuery.findByRefreshToken(tx, req.Token);

      return {};
    }),
};
