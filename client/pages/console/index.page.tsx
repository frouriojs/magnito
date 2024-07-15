import type { UserEntity } from 'common/types/user';
import { Layout } from 'layouts/Layout';
import styles from './index.module.css';

const Main = (_: { user: UserEntity }) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.card}></div>
      </div>
    </div>
  );
};

const Console = () => {
  return <Layout render={(user) => <Main user={user} />} />;
};

export default Console;
