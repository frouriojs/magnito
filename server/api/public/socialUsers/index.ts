import type { DefineMethods } from 'aspida';
import type { MaybeId } from 'common/types/brandedId';
import type { SocialUserCreateVal, SocialUserEntity } from 'common/types/user';

export type Methods = DefineMethods<{
  get: {
    query: { userPoolClientId: MaybeId['userPoolClient'] };
    resBody: SocialUserEntity[];
  };
  post: {
    reqBody: SocialUserCreateVal;
    resBody: SocialUserEntity;
  };
  patch: {
    reqBody: { id: MaybeId['socialUser']; codeChallenge: string };
    resBody: SocialUserEntity;
  };
}>;
