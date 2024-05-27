import { APP_NAME } from 'api/@constants';
import { APP_VERSION } from 'utils/envValues';
import styles from './BasicHeader.module.css';

export const BasicHeader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {APP_NAME} {APP_VERSION}
      </div>
    </div>
  );
};
