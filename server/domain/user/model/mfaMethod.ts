import type { SetUserMFAPreferenceTarget } from 'common/types/auth';
import type { CognitoUserEntity } from 'common/types/user';
import { authenticator } from 'otplib';
import { cognitoAssert } from 'service/cognitoAssert';

export const mfaMethod = {
  generateSecretCode: (user: CognitoUserEntity): CognitoUserEntity => {
    return { ...user, totpSecretCode: authenticator.generateSecret() };
  },
  verify: (user: CognitoUserEntity, userCode: string | undefined): CognitoUserEntity => {
    cognitoAssert(
      userCode && user.totpSecretCode && authenticator.check(userCode, user.totpSecretCode),
      'Invalid verification code provided, please try again.',
    );

    return { ...user, mfaSettingList: ['SOFTWARE_TOKEN_MFA'] };
  },
  setPreference: (
    user: CognitoUserEntity,
    req: SetUserMFAPreferenceTarget['reqBody'],
  ): CognitoUserEntity => {
    return {
      ...user,
      preferredMfaSetting: req.SoftwareTokenMfaSettings?.PreferredMfa
        ? 'SOFTWARE_TOKEN_MFA'
        : user.preferredMfaSetting,
      mfaSettingList: req.SoftwareTokenMfaSettings?.Enabled
        ? ['SOFTWARE_TOKEN_MFA']
        : user.mfaSettingList,
    };
  },
};