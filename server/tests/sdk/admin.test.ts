import { AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { DEFAULT_USER_POOL_ID } from 'service/envValues';
import { createUserClient, testUserName } from 'tests/api/apiClient';
import { expect, test } from 'vitest';

test('AdminDeleteUserCommand', async () => {
  const userClient = await createUserClient();

  const command = new AdminDeleteUserCommand({
    UserPoolId: DEFAULT_USER_POOL_ID,
    Username: testUserName,
  });

  await cognitoClient.send(command);

  await expect(userClient.private.me.get()).rejects.toThrow();
});
