import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Routine } from '../../model/routine.model';
import styles from './routine.module.scss';

interface RoutineProps {
  routine: Routine;
}

export default function RoutineElement(props: RoutineProps) {
  const [toRoutinePage, setToRoutinePage] = useState(false);
  if (toRoutinePage) {
    const url = `/routine/${props.routine.name}`;
    return <Navigate to={url}></Navigate>;
  }
  return (
    <div className={styles.container} onClick={() => setToRoutinePage(true)}>
      <h2>{props.routine.name}</h2>
    </div>
  );
}
