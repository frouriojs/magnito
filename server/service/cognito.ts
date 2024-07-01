import {
  CognitoIdentityProviderClient,
  ListUserPoolsCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ACCESS_KEY, PORT, REGION, SECRET_KEY } from './envValues';

const cognitoClient = new CognitoIdentityProviderClient({
  endpoint: `http://localhost:${PORT}`,
  region: REGION,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

export const cognito = {
  health: async (): Promise<boolean> => {
    const command = new ListUserPoolsCommand({ MaxResults: 1 });

    return await cognitoClient.send(command).then(() => true);
  },
  // deleteUser: async (userName: string): Promise<void> => {
  //   const command = new AdminDeleteUserCommand({
  //     UserPoolId: DEFAULT_USER_POOL_ID,
  //     Username: userName,
  //   });

  //   await cognitoClient.send(command);
  // },
};
