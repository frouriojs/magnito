import { onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { userAtom } from 'src/atoms/user';
import { pagesPath } from 'src/utils/$path';
import { apiClient } from 'src/utils/apiClient';
import { createAuth } from 'src/utils/firebase';
import { returnNull } from 'src/utils/returnNull';
import { Loading } from '../../components/Loading/Loading';

export const AuthLoader = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [isInitedAuth, dispatchIsInitedAuth] = useReducer(() => true, false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(createAuth(), async (fbUser) => {
      if (fbUser) {
        await fbUser
          .getIdToken()
          .then((idToken) => apiClient.session.$post({ body: { idToken } }))
          .catch(returnNull);
        await apiClient.me.$get().catch(returnNull).then(setUser);
      } else {
        await apiClient.session.$delete();
        setUser(null);
      }

      dispatchIsInitedAuth();
    });

    return unsubscribe;
  }, [setUser]);

  useEffect(() => {
    if (!isInitedAuth) return;

    const redirectToHome = async () => {
      router.pathname === pagesPath.login.$url().pathname && (await router.push(pagesPath.$url()));
    };
    const redirectToLogin = async () => {
      router.pathname === pagesPath.$url().pathname && (await router.push(pagesPath.login.$url()));
    };

    user ? redirectToHome() : redirectToLogin();
  }, [router, isInitedAuth, user]);

  return <Loading visible={!isInitedAuth} />;
};
