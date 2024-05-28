import type { AttributesParams, PasswordVerifierParams, SrpAuthParams } from 'api/@types/signIn';

export const signInUseCase = {
  srpAuth: (req: SrpAuthParams['reqBody']): SrpAuthParams['resBody'] => {
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
  },
  passwordVerifier: (
    _req: PasswordVerifierParams['reqBody'],
  ): PasswordVerifierParams['resBody'] => {
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
  },
  attributes: (req: AttributesParams['reqBody']): AttributesParams['resBody'] => {
    return {
      UserAttributes: [
        { Name: 'sub', Value: req.AccessToken },
        { Name: 'email', Value: 'a@example.com' },
        { Name: 'email_verified', Value: 'true' },
      ],
      Username: req.AccessToken,
    };
  },
};
