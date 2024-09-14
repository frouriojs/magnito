import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { AuthLoader } from 'components/Auth/AuthLoader';
import { useCognitoClient } from 'hooks/useCognitoClient';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { apiClient } from 'utils/apiClient';
import { catchApiErr } from 'utils/catchApiErr';
import { NEXT_PUBLIC_API_ORIGIN } from 'utils/envValues';
import '../styles/globals.css';

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });
  const { defaults, setDefaults } = useCognitoClient();

  useMemo(() => {
    if (defaults.userPoolId === undefined) return;

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: defaults.userPoolId,
          userPoolClientId: defaults.userPoolClientId,
          userPoolEndpoint: NEXT_PUBLIC_API_ORIGIN,
          loginWith: {
            email: true,
            oauth: {
              domain: 'localhost:5052',
              scopes: ['openid'],
              redirectSignIn: [location.origin],
              redirectSignOut: [location.origin],
              responseType: 'code',
            },
          },
        },
      },
    });
  }, [defaults]);

  useEffect(() => {
    apiClient.public.defaults.$get().then(setDefaults).catch(catchApiErr);
  }, []);

  return (
    <SafeHydrate>
      {defaults.userPoolId && (
        <Authenticator.Provider>
          <AuthLoader />
          <Component {...pageProps} />
        </Authenticator.Provider>
      )}
    </SafeHydrate>
  );
}

export default MyApp;
