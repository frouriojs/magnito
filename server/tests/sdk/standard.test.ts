import { ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { DEFAULT_USER_POOL_ID } from 'service/envValues';
import { createUserClient, testUserName } from 'tests/api/apiClient';
import { expect, test } from 'vitest';

test(ListUsersCommand.name, async () => {
  await createUserClient();

  const users = await cognitoClient.send(
    new ListUsersCommand({ UserPoolId: DEFAULT_USER_POOL_ID }),
  );

  expect(users.Users).toHaveLength(1);
  expect(users.Users?.[0].Username).toBe(testUserName);
});
