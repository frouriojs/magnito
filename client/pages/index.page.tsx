import { Authenticator } from '@aws-amplify/ui-react';
import { signUp } from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import { useUser } from 'components/Auth/useUser';
import { Loading } from 'components/Loading/Loading';
import { Spacer } from 'components/Spacer';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { pagesPath } from 'utils/$path';
import styles from './index.module.css';

const Home = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.data !== null) router.replace(pagesPath.console.$url());
  }, [user, router]);

  return user.inited && user.data === null ? (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.appName}>{APP_NAME}</div>
        <Spacer axis="y" size={24} />
        <Authenticator
          signUpAttributes={['email']}
          services={{
            handleSignUp: (input) =>
              signUp({
                ...input,
                options: {
                  userAttributes: { ...input.options?.userAttributes },
                  ...input.options,
                  autoSignIn: true,
                },
              }),
          }}
        />
        <Spacer axis="y" size={40} />
      </div>
    </div>
  ) : (
    <Loading visible />
  );
};

export default Home;
