import type { DefineMethods } from 'aspida';
import type { AmzTargets } from '../common/types/auth';

type TargetKey = keyof AmzTargets;
type Target = AmzTargets[TargetKey];

export type Methods = DefineMethods<{
  post: {
    reqHeaders: { 'x-amz-target': TargetKey };
    resHeaders: { 'content-type': 'application/x-amz-json-1.1' };
    reqBody: Target['reqBody'];
    resBody: Target['resBody'];
  };
}>;
