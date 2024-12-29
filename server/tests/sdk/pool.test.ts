import {
  CreateUserPoolClientCommand,
  CreateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { expect, test } from 'vitest';

test(CreateUserPoolCommand.name, async () => {
  const pool = await cognitoClient.send(new CreateUserPoolCommand({ PoolName: 'testPool' }));
  const client = await cognitoClient.send(
    new CreateUserPoolClientCommand({ ClientName: 'testClient', UserPoolId: pool.UserPool?.Id }),
  );

  expect(pool.UserPool?.Name === 'testPool').toBeTruthy();
  expect(client.UserPoolClient?.ClientName === 'testClient').toBeTruthy();
});
