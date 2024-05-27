import type { GeneralUserId } from 'api/@types/brandedId';
import { fetchUserAttributes, getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useAlert } from 'components/Alert/useAlert';
import { useLoading } from 'components/Loading/useLoading';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { useCallback, useEffect } from 'react';
import type { UserDto } from 'utils/types';
import { useUser } from './useUser';

export const AuthLoader = () => {
  const { setUser } = useUser();
  const { setLoading } = useLoading();
  const { setAlert } = useAlert();
  const catchApiErr = useCatchApiErr();
  const fetchUser = useCallback(async (): Promise<UserDto> => {
    const [user, attrs] = await Promise.all([getCurrentUser(), fetchUserAttributes()]);

    if (!attrs.email) throw new Error('email is nothing');

    return {
      id: user.userId as GeneralUserId,
      role: 'general',
      name: user.username,
      email: attrs.email,
    };
  }, []);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, [fetchUser, setUser]);

  useEffect(() => {
    return Hub.listen(
      'auth',
      // eslint-disable-next-line complexity
      async (data) => {
        switch (data.payload.event) {
          case 'customOAuthState':
          case 'signInWithRedirect':
          case 'signInWithRedirect_failure':
          case 'tokenRefresh':
            break;
          case 'signedOut':
            setUser(null);
            break;
          case 'signedIn':
            fetchUser()
              .then(setUser)
              .catch(() => setUser(null));
            break;
          case 'tokenRefresh_failure':
            await setAlert('認証の有効期限が切れました。再度ログインしてください。');
            setLoading(true);
            await signOut().catch(catchApiErr);
            setLoading(false);
            break;
          /* v8 ignore next 2 */
          default:
            throw new Error(data.payload satisfies never);
        }
      },
    );
  }, [catchApiErr, setAlert, setLoading, fetchUser, setUser]);

  return <></>;
};
