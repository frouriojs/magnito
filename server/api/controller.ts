import assert from 'assert';
import { adminUseCase } from 'domain/user/useCase/adminUseCase';
import { authUseCase } from 'domain/user/useCase/authUseCase';
import { mfaUseCase } from 'domain/user/useCase/mfaUseCase';
import { signInUseCase } from 'domain/user/useCase/signInUseCase';
import { signUpUseCase } from 'domain/user/useCase/signUpUseCase';
import { userPoolUseCase } from 'domain/userPool/useCase/userPoolUseCase';
import { returnPostError } from 'service/returnStatus';
import type { AmzTargets } from '../common/types/auth';
import { defineController } from './$relay';

const useCases: {
  [Target in keyof AmzTargets]: (
    req: AmzTargets[Target]['reqBody'],
  ) => Promise<AmzTargets[Target]['resBody']>;
} = {
  'AWSCognitoIdentityProviderService.SignUp': signUpUseCase.signUp,
  'AWSCognitoIdentityProviderService.ConfirmSignUp': signUpUseCase.confirmSignUp,
  'AWSCognitoIdentityProviderService.InitiateAuth': (req) =>
    req.AuthFlow === 'USER_SRP_AUTH'
      ? signInUseCase.userSrpAuth(req)
      : signInUseCase.refreshTokenAuth(req),
  'AWSCognitoIdentityProviderService.RespondToAuthChallenge': signInUseCase.respondToAuthChallenge,
  'AWSCognitoIdentityProviderService.GetUser': authUseCase.getUser,
  'AWSCognitoIdentityProviderService.RevokeToken': authUseCase.revokeToken,
  'AWSCognitoIdentityProviderService.ResendConfirmationCode': signUpUseCase.resendConfirmationCode,
  'AWSCognitoIdentityProviderService.ListUserPools': userPoolUseCase.listUserPools,
  'AWSCognitoIdentityProviderService.ListUsers': authUseCase.listUsers,
  'AWSCognitoIdentityProviderService.AdminGetUser': adminUseCase.getUser,
  'AWSCognitoIdentityProviderService.AdminCreateUser': adminUseCase.createUser,
  'AWSCognitoIdentityProviderService.AdminDeleteUser': adminUseCase.deleteUser,
  'AWSCognitoIdentityProviderService.AdminInitiateAuth': adminUseCase.initiateAuth,
  'AWSCognitoIdentityProviderService.AdminSetUserPassword': adminUseCase.setUserPassword,
  'AWSCognitoIdentityProviderService.AdminUpdateUserAttributes': adminUseCase.updateUserAttributes,
  'AWSCognitoIdentityProviderService.AdminDeleteUserAttributes': adminUseCase.deleteUserAttributes,
  'AWSCognitoIdentityProviderService.ChangePassword': authUseCase.changePassword,
  'AWSCognitoIdentityProviderService.ForgotPassword': authUseCase.forgotPassword,
  'AWSCognitoIdentityProviderService.ConfirmForgotPassword': authUseCase.confirmForgotPassword,
  'AWSCognitoIdentityProviderService.UpdateUserAttributes': authUseCase.updateUserAttributes,
  'AWSCognitoIdentityProviderService.VerifyUserAttribute': authUseCase.verifyUserAttribute,
  'AWSCognitoIdentityProviderService.DeleteUserAttributes': authUseCase.deleteUserAttributes,
  'AWSCognitoIdentityProviderService.AssociateSoftwareToken': mfaUseCase.associateSoftwareToken,
  'AWSCognitoIdentityProviderService.VerifySoftwareToken': mfaUseCase.verifySoftwareToken,
  'AWSCognitoIdentityProviderService.SetUserMFAPreference': mfaUseCase.setUserMFAPreference,
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
