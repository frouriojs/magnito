import { staticPath } from 'utils/$path';
import styles from './BasicHeader.module.css';

export const BasicHeader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <img src={staticPath.frourio_svg} height={36} alt="frourio logo" />
      </div>
    </div>
  );
};
