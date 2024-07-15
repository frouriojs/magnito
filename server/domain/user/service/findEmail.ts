import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';

export const findEmail = (attributes: AttributeType[] | undefined): string => {
  const email = attributes?.find((attr) => attr.Name === 'email')?.Value;
  assert(email);

  return email;
};
