import styles from './routines-page.module.scss';
import { useEffect, useState } from 'react';
import { getRoutines } from '../../db/routine.db';
import { Routine } from '../../model/routine.model';
import RoutineElement from '../../components/routine/routine';

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    getRoutines().subscribe((routines) => {
      if (routines && routines.length > 0) {
        setRoutines(routines);
      }
    });
  }, []);

  const routineElements = routines.map((r) => (
    <RoutineElement key={r.name} routine={r}></RoutineElement>
  ));

  return <div className={styles.container}>{routineElements}</div>;
}
