import { authUseCase } from 'domain/user/useCase/authUseCase';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';
import type { AmzTargets } from './@types/auth';

const targets: {
  [Target in keyof AmzTargets]: {
    validator: z.ZodType<AmzTargets[Target]['reqBody']>;
    useCase: (req: AmzTargets[Target]['reqBody']) => Promise<AmzTargets[Target]['resBody']>;
  };
} = {
  'AWSCognitoIdentityProviderService.SignUp': {
    validator: z.object({
      Username: z.string(),
      Password: z.string(),
      UserAttributes: z.tuple([z.object({ Name: z.literal('email'), Value: z.string().email() })]),
      ClientId: brandedId.userPoolClient.maybe,
    }),
    useCase: authUseCase.SignUp,
  },
  'AWSCognitoIdentityProviderService.ConfirmSignUp': {
    validator: z.object({
      ClientId: brandedId.userPoolClient.maybe,
      ConfirmationCode: z.string(),
      Username: z.string(),
    }),
    useCase: authUseCase.ConfirmSignUp,
  },
  'AWSCognitoIdentityProviderService.InitiateAuth': {
    validator: z
      .object({
        AuthFlow: z.literal('USER_SRP_AUTH'),
        AuthParameters: z.object({ USERNAME: z.string(), SRP_A: z.string() }),
        ClientId: brandedId.userPoolClient.maybe,
      })
      .or(
        z.object({
          AuthFlow: z.literal('REFRESH_TOKEN_AUTH'),
          AuthParameters: z.object({ REFRESH_TOKEN: z.string() }),
          ClientId: brandedId.userPoolClient.maybe,
        }),
      ),
    useCase: (req) =>
      req.AuthFlow === 'USER_SRP_AUTH'
        ? authUseCase.UserSrpAuth(req)
        : authUseCase.ResreshTokenAuth(req),
  },
  'AWSCognitoIdentityProviderService.RespondToAuthChallenge': {
    validator: z.object({
      ChallengeName: z.literal('PASSWORD_VERIFIER'),
      ChallengeResponses: z.object({
        PASSWORD_CLAIM_SECRET_BLOCK: z.string(),
        PASSWORD_CLAIM_SIGNATURE: z.string(),
        TIMESTAMP: z.string(),
        USERNAME: z.string(),
      }),
      ClientId: brandedId.userPoolClient.maybe,
    }),
    useCase: authUseCase.RespondToAuthChallenge,
  },
  'AWSCognitoIdentityProviderService.GetUser': {
    validator: z.object({ AccessToken: z.string() }),
    useCase: authUseCase.GetUser,
  },
  'AWSCognitoIdentityProviderService.RevokeToken': {
    validator: z.object({ ClientId: brandedId.userPoolClient.maybe, Token: z.string() }),
    useCase: authUseCase.RevokeToken,
  },
};

export default defineController(() => ({
  // eslint-disable-next-line complexity
  post: async (req) => {
    const target = req.headers['x-amz-target'];

    switch (target) {
      case 'AWSCognitoIdentityProviderService.SignUp':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.ConfirmSignUp':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.InitiateAuth':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.RespondToAuthChallenge':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.GetUser':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.RevokeToken':
        return {
          status: 200,
          headers: { 'content-type': 'application/x-amz-json-1.1' },
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      /* v8 ignore next 2 */
      default:
        throw new Error(target satisfies never);
    }
  },
}));
