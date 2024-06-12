import type { MaybeId } from './brandedId';

type TargetBody<Req, Res> = { reqBody: Req; resBody: Res };

export type SignUpTarget = TargetBody<
  {
    Username: string;
    Password: string;
    UserAttributes: [{ Name: 'email'; Value: string }];
    ClientId: MaybeId['userPoolClient'];
  },
  Record<string, never>
>;

export type InitiateAuthTarget = TargetBody<
  {
    AuthFlow: 'USER_SRP_AUTH';
    AuthParameters: { USERNAME: string; SRP_A: string };
    ClientId: MaybeId['userPoolClient'];
  },
  {
    ChallengeName: 'PASSWORD_VERIFIER';
    challengeParameters: {
      SALT: string;
      SECRET_BLOCK: string;
      SRP_B: string;
      USERNAME: string;
      USER_ID_FOR_SRP: string;
    };
  }
>;

export type VerifierAuthTarget = TargetBody<
  {
    ChallengeName: 'PASSWORD_VERIFIER';
    ChallengeResponses: {
      PASSWORD_CLAIM_SECRET_BLOCK: string;
      PASSWORD_CLAIM_SIGNATURE: string;
      TIMESTAMP: string;
      USERNAME: string;
    };
    ClientId: string;
  },
  {
    AuthenticationResult: {
      AccessToken: string;
      ExpiresIn: number;
      IdToken: string;
      RefreshToken: string;
      TokenType: 'Bearer';
    };
    ChallengeParameters: Record<string, never>;
  }
>;

export type AttributesTarget = TargetBody<
  { AccessToken: string },
  {
    UserAttributes: [
      { Name: 'sub'; Value: string },
      { Name: 'email'; Value: string },
      { Name: 'email_verified'; Value: 'true' | 'false' },
    ];
    Username: string;
  }
>;

export type AmzTargets = {
  'AWSCognitoIdentityProviderService.SignUp': SignUpTarget;
  'AWSCognitoIdentityProviderService.InitiateAuth': InitiateAuthTarget;
  'AWSCognitoIdentityProviderService.VerifierAuth': VerifierAuthTarget;
  'AWSCognitoIdentityProviderService.Attributes': AttributesTarget;
};
