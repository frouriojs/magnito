import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { createUserClient, testPassword, testUserName } from 'tests/api/apiClient';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('AdminCreateUserCommand', async () => {
  const tmpPass = `TmpPass-${Date.now()}`;

  await cognitoClient.send(
    new AdminCreateUserCommand({
      UserPoolId: DEFAULT_USER_POOL_ID,
      Username: testUserName,
      TemporaryPassword: tmpPass,
      UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
    }),
  );

  const res1 = await cognitoClient.send(
    new AdminGetUserCommand({ UserPoolId: DEFAULT_USER_POOL_ID, Username: testUserName }),
  );

  expect(res1.UserStatus).toBe(UserStatusType.FORCE_CHANGE_PASSWORD);

  await cognitoClient.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: DEFAULT_USER_POOL_ID,
      Username: testUserName,
      Password: testPassword,
    }),
  );

  const res2 = await cognitoClient.send(
    new AdminGetUserCommand({ UserPoolId: DEFAULT_USER_POOL_ID, Username: testUserName }),
  );

  expect(res2.UserStatus).toBe(UserStatusType.CONFIRMED);

  const tokens = await cognitoClient.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: DEFAULT_USER_POOL_ID,
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
      AuthParameters: { USERNAME: testUserName, PASSWORD: testPassword },
    }),
  );

  expect(tokens.AuthenticationResult).toBeTruthy();
});

test('AdminDeleteUserCommand', async () => {
  const userClient = await createUserClient();

  await cognitoClient.send(
    new AdminDeleteUserCommand({ UserPoolId: DEFAULT_USER_POOL_ID, Username: testUserName }),
  );

  await expect(userClient.private.me.get()).rejects.toThrow();
});
