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
  'AWSCognitoIdentityProviderService.InitiateAuth': {
    validator: z.object({
      AuthFlow: z.literal('USER_SRP_AUTH'),
      AuthParameters: z.object({ USERNAME: z.string(), SRP_A: z.string() }),
      ClientId: brandedId.userPoolClient.maybe,
    }),
    useCase: authUseCase.InitiateAuth,
  },
  'AWSCognitoIdentityProviderService.VerifierAuth': {
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
    useCase: authUseCase.VerifierAuth,
  },
  'AWSCognitoIdentityProviderService.Attributes': {
    validator: z.object({ AccessToken: z.string() }),
    useCase: authUseCase.Attributes,
  },
};

export default defineController(() => ({
  post: async (req) => {
    const target = req.headers['X-Amz-Target'];

    switch (target) {
      case 'AWSCognitoIdentityProviderService.SignUp':
        return {
          status: 200,
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.InitiateAuth':
        return {
          status: 200,
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.VerifierAuth':
        return {
          status: 200,
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      case 'AWSCognitoIdentityProviderService.Attributes':
        return {
          status: 200,
          body: await targets[target].useCase(targets[target].validator.parse(req.body)),
        };
      /* v8 ignore next 2 */
      default:
        throw new Error(target satisfies never);
    }
  },
}));
