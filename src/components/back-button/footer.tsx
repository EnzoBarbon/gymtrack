import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import styles from './footer.module.scss';
import { History } from './navigationService';
export class AddService {
  addFunction: () => void = () => {
    console.log('testi');
  };
}
export const addService = new AddService();
export class LoadService {
  loading: Subject<boolean> = new Subject();
}
export const loadService = new LoadService();

export default function Footer() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sub = loadService.loading.subscribe((loadFlag) =>
      setLoading(loadFlag)
    );
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.loading}>
        {loading ? <div className={styles.loadingFill}></div> : <></>}
      </div>
      <button className={styles.back} onClick={() => window.history.back()}>
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <button
        className={styles.center}
        onClick={() => {
          History.push('/timeline');
        }}
      >
        <span className="material-symbols-outlined">timeline</span>
      </button>

      <button className={styles.add} onClick={() => addService.addFunction()}>
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
