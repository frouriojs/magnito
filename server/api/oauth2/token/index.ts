import type { DefineMethods } from 'aspida';
import type { SocialUserRequestTokensVal, SocialUserResponseTokensVal } from 'common/types/user';

export type Methods = DefineMethods<{
  post: {
    reqFormat: URLSearchParams;
    reqBody: SocialUserRequestTokensVal;
    resBody: SocialUserResponseTokensVal;
  };
}>;
