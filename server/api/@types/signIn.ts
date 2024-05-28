export type SrpAuthParams = {
  reqBody: {
    AuthFlow: 'USER_SRP_AUTH';
    AuthParameters: { USERNAME: string; SRP_A: string };
    ClientId: string;
  };
  resBody: {
    ChallengeName: 'PASSWORD_VERIFIER';
    challengeParameters: {
      SALT: string;
      SECRET_BLOCK: string;
      SRP_B: string;
      USERNAME: string;
      USER_ID_FOR_SRP: string;
    };
  };
};

export type PasswordVerifierParams = {
  reqBody: {
    ChallengeName: 'PASSWORD_VERIFIER';
    ChallengeResponses: {
      PASSWORD_CLAIM_SECRET_BLOCK: string;
      PASSWORD_CLAIM_SIGNATURE: string;
      TIMESTAMP: string;
      USERNAME: string;
    };
    ClientId: string;
  };
  resBody: {
    AuthenticationResult: {
      AccessToken: string;
      ExpiresIn: number;
      IdToken: string;
      RefreshToken: string;
      TokenType: 'Bearer';
    };
    ChallengeParameters: Record<string, never>;
  };
};

export type AttributesParams = {
  reqBody: {
    AccessToken: string;
  };
  resBody: {
    UserAttributes: [
      { Name: 'sub'; Value: string },
      { Name: 'email'; Value: string },
      { Name: 'email_verified'; Value: 'true' | 'false' },
    ];
    Username: string;
  };
};

export type SingInParams = SrpAuthParams | PasswordVerifierParams | AttributesParams;
