import assert from 'assert';
import { adminUseCase } from 'domain/user/useCase/adminUseCase';
import { authUseCase } from 'domain/user/useCase/authUseCase';
import { returnPostError } from 'service/returnStatus';
import type { AmzTargets } from '../common/types/auth';
import { defineController } from './$relay';

const useCases: {
  [Target in keyof AmzTargets]: (
    req: AmzTargets[Target]['reqBody'],
  ) => Promise<AmzTargets[Target]['resBody']>;
} = {
  'AWSCognitoIdentityProviderService.SignUp': authUseCase.signUp,
  'AWSCognitoIdentityProviderService.ConfirmSignUp': authUseCase.confirmSignUp,
  'AWSCognitoIdentityProviderService.InitiateAuth': (req) =>
    req.AuthFlow === 'USER_SRP_AUTH'
      ? authUseCase.userSrpAuth(req)
      : authUseCase.refreshTokenAuth(req),
  'AWSCognitoIdentityProviderService.RespondToAuthChallenge': authUseCase.respondToAuthChallenge,
  'AWSCognitoIdentityProviderService.GetUser': authUseCase.getUser,
  'AWSCognitoIdentityProviderService.RevokeToken': authUseCase.revokeToken,
  'AWSCognitoIdentityProviderService.ResendConfirmationCode': authUseCase.resendConfirmationCode,
  'AWSCognitoIdentityProviderService.ListUserPools': authUseCase.listUserPools,
  'AWSCognitoIdentityProviderService.AdminGetUser': adminUseCase.getUser,
  'AWSCognitoIdentityProviderService.AdminCreateUser': adminUseCase.createUser,
  'AWSCognitoIdentityProviderService.AdminDeleteUser': adminUseCase.deleteUser,
  'AWSCognitoIdentityProviderService.AdminInitiateAuth': adminUseCase.initiateAuth,
  'AWSCognitoIdentityProviderService.AdminSetUserPassword': adminUseCase.setUserPassword,
  'AWSCognitoIdentityProviderService.ChangePassword': authUseCase.changePassword,
  'AWSCognitoIdentityProviderService.ForgotPassword': authUseCase.forgotPassword,
  'AWSCognitoIdentityProviderService.ConfirmForgotPassword': authUseCase.confirmForgotPassword,
};

const main = <T extends keyof AmzTargets>(target: T, body: AmzTargets[T]['reqBody']) => {
  assert(useCases[target], JSON.stringify({ target, body }));

  return useCases[target](body);
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
