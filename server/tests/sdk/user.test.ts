import {
  GetUserCommand,
  UpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from 'service/cognito';
import { createUserAndToken } from 'tests/api/utils';
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
