import type {
  AdminDeleteUserRequest,
  ListUserPoolsRequest,
  ListUserPoolsResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import type { EntityId, MaybeId } from './brandedId';

export type Jwks = { keys: [{ kid: string; alg: string }] };

type TargetBody<Req, Res> = { reqBody: Req; resBody: Res };

export type CodeDeliveryDetails = {
  AttributeName: 'email';
  DeliveryMedium: 'EMAIL';
  Destination: string;
};

export type SignUpTarget = TargetBody<
  {
    Username: string;
    Password: string;
    UserAttributes: [{ Name: 'email'; Value: string }];
    ClientId: MaybeId['userPoolClient'];
  },
  { CodeDeliveryDetails: CodeDeliveryDetails; UserConfirmed: boolean; UserSub: EntityId['user'] }
>;

export type ConfirmSignUpTarget = TargetBody<
  {
    ClientId: MaybeId['userPoolClient'];
    ConfirmationCode: string;
    Username: string;
  },
  Record<string, never>
>;

export type UserSrpAuthTarget = TargetBody<
  {
    AuthFlow: 'USER_SRP_AUTH';
    AuthParameters: { USERNAME: string; SRP_A: string };
    ClientId: MaybeId['userPoolClient'];
  },
  {
    ChallengeName: 'PASSWORD_VERIFIER';
    ChallengeParameters: {
      SALT: string;
      SECRET_BLOCK: string;
      SRP_B: string;
      USERNAME: string;
      USER_ID_FOR_SRP: string;
    };
  }
>;

export type RefreshTokenAuthTarget = TargetBody<
  {
    AuthFlow: 'REFRESH_TOKEN_AUTH';
    AuthParameters: { REFRESH_TOKEN: string };
    ClientId: MaybeId['userPoolClient'];
  },
  {
    AuthenticationResult: {
      AccessToken: string;
      ExpiresIn: number;
      IdToken: string;
      TokenType: 'Bearer';
    };
    ChallengeParameters: Record<string, never>;
  }
>;

export type RespondToAuthChallengeTarget = TargetBody<
  {
    ChallengeName: 'PASSWORD_VERIFIER';
    ChallengeResponses: {
      PASSWORD_CLAIM_SECRET_BLOCK: string;
      PASSWORD_CLAIM_SIGNATURE: string;
      TIMESTAMP: string;
      USERNAME: string;
    };
    ClientId: MaybeId['userPoolClient'];
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

export type GetUserTarget = TargetBody<
  { AccessToken: string },
  {
    UserAttributes: [
      { Name: 'sub'; Value: EntityId['user'] },
      { Name: 'email'; Value: string },
      { Name: 'email_verified'; Value: 'true' | 'false' },
    ];
    Username: string;
  }
>;

export type RevokeTokenTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; Token: string },
  Record<string, never>
>;

export type ResendConfirmationCodeTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; Username: string },
  { CodeDeliveryDetails: CodeDeliveryDetails }
>;

export type ListUserPoolsTarget = TargetBody<ListUserPoolsRequest, ListUserPoolsResponse>;

export type AdminDeleteUserTarget = TargetBody<AdminDeleteUserRequest, Record<string, never>>;

export type AmzTargets = {
  'AWSCognitoIdentityProviderService.SignUp': SignUpTarget;
  'AWSCognitoIdentityProviderService.ConfirmSignUp': ConfirmSignUpTarget;
  'AWSCognitoIdentityProviderService.InitiateAuth': UserSrpAuthTarget | RefreshTokenAuthTarget;
  'AWSCognitoIdentityProviderService.RespondToAuthChallenge': RespondToAuthChallengeTarget;
  'AWSCognitoIdentityProviderService.GetUser': GetUserTarget;
  'AWSCognitoIdentityProviderService.RevokeToken': RevokeTokenTarget;
  'AWSCognitoIdentityProviderService.ResendConfirmationCode': ResendConfirmationCodeTarget;
  'AWSCognitoIdentityProviderService.ListUserPools': ListUserPoolsTarget;
  'AWSCognitoIdentityProviderService.AdminDeleteUser': AdminDeleteUserTarget;
};
