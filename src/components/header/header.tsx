import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import styles from './header.module.scss';

export default function Header() {
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName ?? 'noname');
      }
    });
  }, []);
  return (
    <div className={styles.container}>
      <h1>GYM TRACK</h1>
      <div className={styles.account}>
        <span className={`material-symbols-outlined ${styles.accountIcon}}`}>
          account_circle
        </span>
        <span className={styles.username}>{username}</span>
      </div>
    </div>
  );
}
