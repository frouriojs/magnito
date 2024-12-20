import {
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  VerifySoftwareTokenResponseType,
} from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import { authenticator } from 'otplib';
import { cognitoClient } from 'service/cognito';
import { createCognitoUserAndToken } from 'tests/api/utils';
import { expect, test } from 'vitest';

test(AssociateSoftwareTokenCommand.name, async () => {
  const token = await createCognitoUserAndToken();
  const session = 'dummySession';

  const res = await cognitoClient.send(
    new AssociateSoftwareTokenCommand({ AccessToken: token.AccessToken, Session: session }),
  );

  expect(res.SecretCode).toHaveLength(16);
  expect(res.Session).toBe(session);
});

test(VerifySoftwareTokenCommand.name, async () => {
  const token = await createCognitoUserAndToken();
  const session = 'dummySession';

  const { SecretCode } = await cognitoClient.send(
    new AssociateSoftwareTokenCommand({ AccessToken: token.AccessToken, Session: session }),
  );

  assert(SecretCode);

  const res = await cognitoClient.send(
    new VerifySoftwareTokenCommand({
      AccessToken: token.AccessToken,
      Session: session,
      UserCode: authenticator.generate(SecretCode),
    }),
  );

  expect(res.Status).toBe(VerifySoftwareTokenResponseType.SUCCESS);
});
