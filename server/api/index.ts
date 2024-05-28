import type { DefineMethods } from 'aspida';
import type { SingInParams } from './@types/signIn';

export type Methods = DefineMethods<{
  get: {
    resBody: string;
  };
  post: {
    reqBody: SingInParams['reqBody'];
    resBody: SingInParams['resBody'];
  };
}>;
