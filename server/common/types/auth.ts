import type {
  AdminCreateUserRequest,
  AdminCreateUserResponse,
  AdminDeleteUserRequest,
  AdminGetUserRequest,
  AdminGetUserResponse,
  AdminInitiateAuthRequest,
  AdminInitiateAuthResponse,
  AdminSetUserPasswordRequest,
  AdminSetUserPasswordResponse,
  CodeDeliveryDetailsType,
  GetUserResponse,
  ListUserPoolsRequest,
  ListUserPoolsResponse,
  SignUpRequest,
  SignUpResponse,
} from '@aws-sdk/client-cognito-identity-provider';
import type { MaybeId } from './brandedId';

export type Jwks = { keys: [{ kid: string; alg: string }] };

type TargetBody<Req, Res> = { reqBody: Req; resBody: Res };

export type SignUpTarget = TargetBody<SignUpRequest, SignUpResponse>;

export type ConfirmSignUpTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; ConfirmationCode: string; Username: string },
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

export type GetUserTarget = TargetBody<{ AccessToken: string }, GetUserResponse>;

export type RevokeTokenTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; Token: string },
  Record<string, never>
>;

export type ResendConfirmationCodeTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; Username: string },
  { CodeDeliveryDetails: CodeDeliveryDetailsType }
>;

export type ListUserPoolsTarget = TargetBody<ListUserPoolsRequest, ListUserPoolsResponse>;

export type AdminGetUserTarget = TargetBody<AdminGetUserRequest, AdminGetUserResponse>;

export type AdminCreateUserTarget = TargetBody<AdminCreateUserRequest, AdminCreateUserResponse>;

export type AdminDeleteUserTarget = TargetBody<AdminDeleteUserRequest, Record<string, never>>;

export type AdminInitiateAuthTarget = TargetBody<
  AdminInitiateAuthRequest,
  AdminInitiateAuthResponse
>;

export type AdminSetUserPasswordTarget = TargetBody<
  AdminSetUserPasswordRequest,
  AdminSetUserPasswordResponse
>;

export type ChangePasswordTarget = TargetBody<
  { AccessToken: string; PreviousPassword: string; ProposedPassword: string },
  Record<string, never>
>;

export type ForgotPasswordTarget = TargetBody<
  { ClientId: MaybeId['userPoolClient']; Username: string },
  { CodeDeliveryDetails: CodeDeliveryDetailsType }
>;

export type ConfirmForgotPasswordTarget = TargetBody<
  {
    ClientId: MaybeId['userPoolClient'];
    ConfirmationCode: string;
    Password: string;
    Username: string;
  },
  Record<string, never>
>;

export type AmzTargets = {
  'AWSCognitoIdentityProviderService.SignUp': SignUpTarget;
  'AWSCognitoIdentityProviderService.ConfirmSignUp': ConfirmSignUpTarget;
  'AWSCognitoIdentityProviderService.InitiateAuth': UserSrpAuthTarget | RefreshTokenAuthTarget;
  'AWSCognitoIdentityProviderService.RespondToAuthChallenge': RespondToAuthChallengeTarget;
  'AWSCognitoIdentityProviderService.GetUser': GetUserTarget;
  'AWSCognitoIdentityProviderService.RevokeToken': RevokeTokenTarget;
  'AWSCognitoIdentityProviderService.ResendConfirmationCode': ResendConfirmationCodeTarget;
  'AWSCognitoIdentityProviderService.ListUserPools': ListUserPoolsTarget;
  'AWSCognitoIdentityProviderService.AdminGetUser': AdminGetUserTarget;
  'AWSCognitoIdentityProviderService.AdminCreateUser': AdminCreateUserTarget;
  'AWSCognitoIdentityProviderService.AdminDeleteUser': AdminDeleteUserTarget;
  'AWSCognitoIdentityProviderService.AdminInitiateAuth': AdminInitiateAuthTarget;
  'AWSCognitoIdentityProviderService.AdminSetUserPassword': AdminSetUserPasswordTarget;
  'AWSCognitoIdentityProviderService.ChangePassword': ChangePasswordTarget;
  'AWSCognitoIdentityProviderService.ForgotPassword': ForgotPasswordTarget;
  'AWSCognitoIdentityProviderService.ConfirmForgotPassword': ConfirmForgotPasswordTarget;
};
