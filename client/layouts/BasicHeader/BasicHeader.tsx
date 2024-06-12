import { APP_NAME } from 'api/@constants';
import type { UserEntity } from 'api/@types/user';
import { signOut } from 'aws-amplify/auth';
import { useConfirm } from 'components/Confirm/useConfirm';
import { APP_VERSION } from 'utils/envValues';
import styles from './BasicHeader.module.css';

export const BasicHeader = (props: { user: UserEntity }) => {
  const { setConfirm } = useConfirm();
  const onClick = async () => {
    const confirmed = await setConfirm(
      `ユーザー名: ${props.user.name}\nメールアドレス: ${props.user.email}\n\nサインアウトしてよろしいですか？`,
    );

    if (confirmed) await signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <span>
          {APP_NAME} {APP_VERSION}
        </span>
        <div className={styles.userBtn} onClick={onClick}>
          {props.user.name}
        </div>
      </div>
    </div>
  );
};
