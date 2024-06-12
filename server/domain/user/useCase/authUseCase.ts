import type {
  AttributesTarget,
  InitiateAuthTarget,
  SignUpTarget,
  VerifierAuthTarget,
} from 'api/@types/auth';
import { transaction } from 'service/prismaClient';
import { userMethod } from '../model/userMethod';
import { userCommand } from '../repository/userCommand';

export const authUseCase = {
  SignUp: (req: SignUpTarget['reqBody']): Promise<SignUpTarget['resBody']> =>
    transaction(async (tx) => {
      const user = userMethod.createUser({
        name: req.Username,
        email: req.UserAttributes[0].Value,
      });
      await userCommand.save(tx, user);

      return {};
    }),
  InitiateAuth: (req: InitiateAuthTarget['reqBody']): Promise<InitiateAuthTarget['resBody']> =>
    transaction(async (_tx) => {
      return {
        ChallengeName: 'PASSWORD_VERIFIER',
        challengeParameters: {
          SALT: 'string',
          SECRET_BLOCK: 'string',
          SRP_B: 'string',
          USERNAME: req.AuthParameters.USERNAME,
          USER_ID_FOR_SRP: req.AuthParameters.USERNAME,
        },
      };
    }),
  VerifierAuth: (_req: VerifierAuthTarget['reqBody']): Promise<VerifierAuthTarget['resBody']> =>
    transaction(async (_tx) => {
      return {
        AuthenticationResult: {
          AccessToken: 'string',
          ExpiresIn: 3600,
          IdToken: 'string',
          RefreshToken: 'string',
          TokenType: 'Bearer',
        },
        ChallengeParameters: {},
      };
    }),
  Attributes: (req: AttributesTarget['reqBody']): Promise<AttributesTarget['resBody']> =>
    transaction(async (_tx) => {
      return {
        UserAttributes: [
          { Name: 'sub', Value: req.AccessToken },
          { Name: 'email', Value: 'a@example.com' },
          { Name: 'email_verified', Value: 'true' },
        ],
        Username: req.AccessToken,
      };
    }),
};
