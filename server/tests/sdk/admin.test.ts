import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { createUserClient, deleteUser, testPassword, testUserName } from 'tests/api/apiClient';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('AdminCreateUserCommand', async () => {
  await cognitoClient.send(
    new AdminCreateUserCommand({
      UserPoolId: DEFAULT_USER_POOL_ID,
      Username: testUserName,
      DesiredDeliveryMediums: ['EMAIL'],
      TemporaryPassword: testPassword,
      MessageAction: 'SUPPRESS',
      UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
    }),
  );

  const res = await cognitoClient.send(
    new AdminGetUserCommand({ UserPoolId: DEFAULT_USER_POOL_ID, Username: testUserName }),
  );

  expect(res.UserStatus).toBe(UserStatusType.FORCE_CHANGE_PASSWORD);

  const tokens = await cognitoClient.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: DEFAULT_USER_POOL_ID,
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
      AuthParameters: { USERNAME: testUserName, PASSWORD: testPassword },
    }),
  );

  expect(tokens.AuthenticationResult).toBeTruthy();

  await deleteUser();
});

test('AdminDeleteUserCommand', async () => {
  const userClient = await createUserClient();

  await cognitoClient.send(
    new AdminDeleteUserCommand({ UserPoolId: DEFAULT_USER_POOL_ID, Username: testUserName }),
  );

  await expect(userClient.private.me.get()).rejects.toThrow();
});
