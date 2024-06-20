import type { RespondToAuthChallengeTarget } from 'api/@types/auth';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      username: string;
      email: string;
      password: string;
    };
    resBody: RespondToAuthChallengeTarget['resBody']['AuthenticationResult'];
  };
}>;
