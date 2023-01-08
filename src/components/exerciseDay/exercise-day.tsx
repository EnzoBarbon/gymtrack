import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ExerciseDay } from '../../model/routine.model';
import styles from './exercise-day.module.scss';

interface ExerciseDayProps {
  exerciseDay: ExerciseDay;
  routineId: string;
}

export default function ExerciseDayElement(props: ExerciseDayProps) {
  const [toExerciseDayPage, setToExerciseDayPage] = useState(false);

  const exercises = props.exerciseDay.exercises.map((ex) => {
    return (
      <div key={ex.name} className={styles.ex}>
        {ex.name}
      </div>
    );
  });
  if (toExerciseDayPage) {
    const url = `day/${props.exerciseDay.id}`;
    return <Navigate to={url}></Navigate>;
  }
  return (
    <div
      className={styles.container}
      onClick={() => setToExerciseDayPage(true)}
    >
      <h2>{props.exerciseDay.name}</h2>
      <div className={styles.exerContainer}>{exercises}</div>
      <button className={styles.delete}>BORRAR</button>
    </div>
  );
}
