import type { OAuthConfig } from '@aws-amplify/core';

export type Query = {
  redirect_uri: string;
  response_type: OAuthConfig['responseType'];
  client_id: string;
  identity_provider: OAuthConfig['providers'];
  scope: OAuthConfig['scopes'];
  state: string;
};

const Authorize = () => {
  return <div>aaa</div>;
};

export default Authorize;
