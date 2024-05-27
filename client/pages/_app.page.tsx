import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { AuthLoader } from 'components/Auth/AuthLoader';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import {
  NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
  NEXT_PUBLIC_COGNITO_POOL_ID,
} from 'utils/envValues';
import '../styles/globals.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolEndpoint: NEXT_PUBLIC_COGNITO_POOL_ENDPOINT,
      userPoolId: NEXT_PUBLIC_COGNITO_POOL_ID,
      userPoolClientId: NEXT_PUBLIC_COGNITO_CLIENT_ID,
    },
  },
});

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });

  return (
    <SafeHydrate>
      <Authenticator.Provider>
        <AuthLoader />
        <Component {...pageProps} />
      </Authenticator.Provider>
    </SafeHydrate>
  );
}

export default MyApp;
