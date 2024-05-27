import { useAlert } from 'components/Alert/useAlert';
import { useUser } from 'components/Auth/useUser';
import { useConfirm } from 'components/Confirm/useConfirm';
import { Loading } from 'components/Loading/Loading';
import { useLoading } from 'components/Loading/useLoading';
import { BasicHeader } from 'layouts/BasicHeader/BasicHeader';
import { useRouter } from 'next/router';
import React from 'react';
import { pagesPath } from 'utils/$path';
import type { UserDto } from 'utils/types';

export const Layout = <T extends UserDto['role']>(props: {
  pageRole: T;
  content: (user: UserDto & { role: T }) => React.ReactNode;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { loadingElm } = useLoading();
  const { alertElm } = useAlert();
  const { confirmElm } = useConfirm();

  if (!user.inited) {
    return <Loading visible />;
  } else if (user.data?.role !== props.pageRole) {
    void router.replace(pagesPath.$url());

    return <Loading visible />;
  }

  return (
    <div>
      <BasicHeader user={user.data} />
      {props.content(user.data as UserDto & { role: T })}
      {loadingElm}
      {alertElm}
      {confirmElm}
    </div>
  );
};
