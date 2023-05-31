import { useAtom } from 'jotai';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { userAtom } from '../atoms/user';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);

  return (
    user && (
      <>
        <BasicHeader user={user} />
        <div className={styles.title} style={{ marginTop: '160px' }}>
          Welcome to frourio!
        </div>
      </>
    )
  );
};

export default Home;
