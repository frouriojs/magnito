import type { UserEntity } from 'api/@types/user';
import { HumanIcon } from 'components/icons/HumanIcon';
import { staticPath } from 'utils/$path';
import { logout } from 'utils/login';
import styles from './BasicHeader.module.css';

export const BasicHeader = ({ user }: { user: UserEntity }) => {
  const onLogout = async () => {
    if (confirm('Logout?')) await logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <img src={staticPath.frourio_svg} height={36} alt="frourio logo" />

        <div className={styles.userBtn} onClick={onLogout}>
          {user.photoURL !== undefined ? (
            <img
              className={styles.userIcon}
              src={user.photoURL}
              height={24}
              alt={user.displayName}
            />
          ) : (
            <HumanIcon size={18} fill="#555" />
          )}
          <span className={styles.userName}>{user.displayName}</span>
        </div>
      </div>
    </div>
  );
};
