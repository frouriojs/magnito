import assert from 'assert';
import { adminUseCase } from 'domain/user/useCase/adminUseCase';
import { authUseCase } from 'domain/user/useCase/authUseCase';
import { brandedId } from 'service/brandedId';
import { returnPostError } from 'service/returnStatus';
import { z } from 'zod';
import type { AmzTargets } from '../common/types/auth';
import { defineController } from './$relay';

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
  'AWSCognitoIdentityProviderService.ListUserPools': {
    validator: z.object({ MaxResults: z.number(), NextToken: z.string().optional() }),
    useCase: authUseCase.listUserPools,
  },
  'AWSCognitoIdentityProviderService.AdminGetUser': {
    validator: z.object({ UserPoolId: brandedId.userPool.maybe, Username: z.string() }),
    useCase: adminUseCase.getUser,
  },
  'AWSCognitoIdentityProviderService.AdminCreateUser': {
    validator: z.object({
      UserPoolId: brandedId.userPool.maybe,
      Username: z.string(),
      UserAttributes: z
        .array(z.object({ Name: z.string(), Value: z.string().optional() }))
        .optional(),
      ValidationData: z
        .array(z.object({ Name: z.string(), Value: z.string().optional() }))
        .optional(),
      TemporaryPassword: z.string().optional(),
      ForceAliasCreation: z.boolean().optional(),
      MessageAction: z.enum(['RESEND', 'SUPPRESS']).optional(),
      DesiredDeliveryMediums: z.array(z.enum(['EMAIL', 'SMS'])).optional(),
      ClientMetadata: z.record(z.string()).optional(),
    }),
    useCase: adminUseCase.createUser,
  },
  'AWSCognitoIdentityProviderService.AdminDeleteUser': {
    validator: z.object({ UserPoolId: brandedId.userPool.maybe, Username: z.string() }),
    useCase: adminUseCase.deleteUser,
  },
  'AWSCognitoIdentityProviderService.AdminInitiateAuth': {
    validator: z.object({
      AuthFlow: z.literal('ADMIN_NO_SRP_AUTH'),
      UserPoolId: brandedId.userPool.maybe,
      ClientId: brandedId.userPoolClient.maybe,
      AuthParameters: z.object({ USERNAME: z.string(), PASSWORD: z.string() }),
    }),
    useCase: adminUseCase.initiateAuth,
  },
  'AWSCognitoIdentityProviderService.ChangePassword': {
    validator: z.object({
      AccessToken: z.string(),
      PreviousPassword: z.string(),
      ProposedPassword: z.string(),
    }),
    useCase: authUseCase.changePassword,
  },
  'AWSCognitoIdentityProviderService.ForgotPassword': {
    validator: z.object({
      ClientId: brandedId.userPoolClient.maybe,
      Username: z.string(),
    }),
    useCase: authUseCase.forgotPassword,
  },
  'AWSCognitoIdentityProviderService.ConfirmForgotPassword': {
    validator: z.object({
      ClientId: brandedId.userPoolClient.maybe,
      ConfirmationCode: z.string(),
      Password: z.string(),
      Username: z.string(),
    }),
    useCase: authUseCase.confirmForgotPassword,
  },
};

const main = <T extends keyof AmzTargets>(target: T, body: AmzTargets[T]['reqBody']) => {
  assert(targets[target], JSON.stringify({ target, body }));

  return targets[target].useCase(targets[target].validator.parse(body));
};

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
