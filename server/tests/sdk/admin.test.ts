import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { createUserClient, deleteUser, testPassword, testUserName } from 'tests/api/apiClient';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('AdminCreateUserCommand', async () => {
  const command1 = new AdminCreateUserCommand({
    UserPoolId: DEFAULT_USER_POOL_ID,
    Username: testUserName,
    TemporaryPassword: testPassword,
    UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
  });

  await cognitoClient.send(command1);

  const command2 = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: DEFAULT_USER_POOL_ID,
    ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: testUserName, PASSWORD: testPassword },
  });

  const tokens = await cognitoClient.send(command2);

  expect(tokens.AuthenticationResult).toBeTruthy();

  await deleteUser();
});

test('AdminDeleteUserCommand', async () => {
  const userClient = await createUserClient();

  const command = new AdminDeleteUserCommand({
    UserPoolId: DEFAULT_USER_POOL_ID,
    Username: testUserName,
  });

  await cognitoClient.send(command);

  await expect(userClient.private.me.get()).rejects.toThrow();
});
