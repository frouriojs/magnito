import {
  DeleteUserAttributesCommand,
  GetUserCommand,
  UpdateUserAttributesCommand,
  VerifyUserAttributeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { createUserAndToken, fetchMailBodyAndTrash } from 'tests/api/utils';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test(UpdateUserAttributesCommand.name, async () => {
  const token = await createUserAndToken();
  const attrName1 = 'custom:test1';
  const attrVal1 = 'sample1';
  const attrName2 = 'custom:test2';
  const attrVal2 = 'sample2';
  const attrVal3 = 'sample3';

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      ...token,
      UserAttributes: [
        { Name: attrName1, Value: attrVal1 },
        { Name: attrName2, Value: attrVal2 },
      ],
    }),
  );

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      ...token,
      UserAttributes: [{ Name: attrName1, Value: attrVal3 }],
    }),
  );

  const user = await cognitoClient.send(new GetUserCommand(token));
  const targetAttr1 = user.UserAttributes?.find((attr) => attr.Name === attrName1);
  const targetAttr2 = user.UserAttributes?.find((attr) => attr.Name === attrName2);

  expect(targetAttr1?.Value).toBe(attrVal3);
  expect(targetAttr2?.Value).toBe(attrVal2);
});

test(VerifyUserAttributeCommand.name, async () => {
  const token = await createUserAndToken();
  const newEmail = `${ulid()}@example.com`;

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      ...token,
      UserAttributes: [{ Name: 'email', Value: newEmail }],
    }),
  );

  const message = await fetchMailBodyAndTrash(newEmail);

  await cognitoClient.send(
    new VerifyUserAttributeCommand({
      ...token,
      AttributeName: 'email',
      Code: message.split(' ').at(-1),
    }),
  );

  const user = await cognitoClient.send(new GetUserCommand(token));
  const emailAttr = user.UserAttributes?.find((attr) => attr.Name === 'email');

  expect(emailAttr?.Value).toBe(newEmail);
});

test(DeleteUserAttributesCommand.name, async () => {
  const token = await createUserAndToken();
  const attrName1 = 'custom:test1';
  const attrName2 = 'custom:test2';

  await cognitoClient.send(
    new UpdateUserAttributesCommand({
      ...token,
      UserAttributes: [
        { Name: attrName1, Value: 'sample1' },
        { Name: attrName2, Value: 'sample2' },
      ],
    }),
  );

  await cognitoClient.send(
    new DeleteUserAttributesCommand({ ...token, UserAttributeNames: [attrName1] }),
  );

  const user = await cognitoClient.send(new GetUserCommand(token));

  expect(user.UserAttributes?.every((attr) => attr.Name !== attrName1)).toBeTruthy();
  expect(user.UserAttributes?.some((attr) => attr.Name === attrName2)).toBeTruthy();
});
