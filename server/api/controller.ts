import { authUseCase } from 'domain/user/useCase/authUseCase';
import { brandedId } from 'service/brandedId';
import { returnPostError } from 'service/returnStatus';
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
    useCase: authUseCase.signUp,
  },
  'AWSCognitoIdentityProviderService.ConfirmSignUp': {
    validator: z.object({
      ClientId: brandedId.userPoolClient.maybe,
      ConfirmationCode: z.string(),
      Username: z.string(),
    }),
    useCase: authUseCase.confirmSignUp,
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
        ? authUseCase.userSrpAuth(req)
        : authUseCase.refreshTokenAuth(req),
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
    useCase: authUseCase.respondToAuthChallenge,
  },
  'AWSCognitoIdentityProviderService.GetUser': {
    validator: z.object({ AccessToken: z.string() }),
    useCase: authUseCase.getUser,
  },
  'AWSCognitoIdentityProviderService.RevokeToken': {
    validator: z.object({ ClientId: brandedId.userPoolClient.maybe, Token: z.string() }),
    useCase: authUseCase.revokeToken,
  },
  'AWSCognitoIdentityProviderService.ResendConfirmationCode': {
    validator: z.object({ ClientId: brandedId.userPoolClient.maybe, Username: z.string() }),
    useCase: authUseCase.resendConfirmationCode,
  },
};

const main = async <T extends keyof AmzTargets>(target: T, body: AmzTargets[T]['reqBody']) =>
  targets[target].useCase(targets[target].validator.parse(body));

export default defineController(() => ({
  post: (req) =>
    main(req.headers['x-amz-target'], req.body)
      .then((body) => ({
        status: 200 as const,
        headers: { 'content-type': 'application/x-amz-json-1.1' } as const,
        body,
      }))
      .catch(returnPostError),
}));
