import { Authenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import { AuthLoader } from 'components/Auth/AuthLoader';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import { NEXT_PUBLIC_API_ORIGIN } from 'utils/envValues';
import '../styles/globals.css';

I18n.putVocabularies(translations);
I18n.setLanguage('ja');

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), { ssr: false });
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    apiClient.public.defaults.$get().then((defaults) => {
      Amplify.configure({
        Auth: { Cognito: { ...defaults, userPoolEndpoint: NEXT_PUBLIC_API_ORIGIN } },
      });

      setConfigured(true);
    });
  }, []);

  return (
    <SafeHydrate>
      {configured && (
        <Authenticator.Provider>
          <AuthLoader />
          <Component {...pageProps} />
        </Authenticator.Provider>
      )}
    </SafeHydrate>
  );
}

export default MyApp;
