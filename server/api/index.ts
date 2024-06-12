import type { DefineMethods } from 'aspida';
import type { AmzTargets } from './@types/auth';

export type Methods = DefineMethods<{
  post: {
    reqHeaders: { 'x-amz-target': keyof AmzTargets };
    resHeaders: { 'content-type': 'application/x-amz-json-1.1' };
    reqBody: AmzTargets[keyof AmzTargets]['reqBody'];
    resBody: AmzTargets[keyof AmzTargets]['resBody'];
  };
}>;
