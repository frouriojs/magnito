import type { DefineMethods } from 'aspida';
import type { AmzTargets } from './@types/auth';

export type Methods = DefineMethods<{
  post: {
    reqHeaders: { 'x-amz-target': keyof AmzTargets };
    reqBody: AmzTargets[keyof AmzTargets]['reqBody'];
    resBody: AmzTargets[keyof AmzTargets]['resBody'];
  };
}>;
