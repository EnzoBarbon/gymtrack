import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExerciseDay } from '../../db/routine.db';
import { ExerciseDay, Routine } from '../../model/routine.model';
import AddExerciseDay from '../add-dialogs/add-exercise-day/add-exercise-day';
import styles from './exercise-day.module.scss';

interface ExerciseDayProps {
  exerciseDay: ExerciseDay;
  routine: Routine;
  onRemoveClick: () => void;
  onEdit: () => void;
}

export default function ExerciseDayElement(props: ExerciseDayProps) {
  const navigate = useNavigate();
  const [editExerciseDay, setEditExerciseDay] = useState<JSX.Element>();

  const closeEditExerciseDayDialog = (
    sucess: boolean,
    routine: Routine,
    exerciseDay?: ExerciseDay
  ) => {
    if (sucess && exerciseDay) {
      if (!routine)
        throw new Error(
          'Attempted to create exercise day with unfound routine'
        );
      addExerciseDay(routine.id!, exerciseDay).subscribe(() => {
        props.onEdit();
      });
    }
    setEditExerciseDay(<></>);
  };

  const openEditExerciseDayDialog = (event: any) => {
    event.stopPropagation();
    setEditExerciseDay(
      <AddExerciseDay
        onExit={closeEditExerciseDayDialog}
        routine={props.routine}
        exerciseDay={props.exerciseDay}
      ></AddExerciseDay>
    );
  };

  const exercises = props.exerciseDay.exercises
    .filter((ex) => !ex.old)
    .map((ex) => {
      return (
        <div key={ex.name} className={styles.ex}>
          {ex.name}
        </div>
      );
    });
  const removeHandler = () => {
    props.onRemoveClick();
  };
  return (
    <>
      {editExerciseDay}
      <div className={styles.container}>
        <button className={styles.delete} onClick={removeHandler}>
          <span className="material-symbols-outlined">delete</span>
        </button>
        <div
          style={{ marginTop: '.3rem' }}
          onClick={() => navigate(`day/${props.exerciseDay.id}`)}
        >
          <h2>{props.exerciseDay.name}</h2>
          <div className={styles.exerContainer}>{exercises}</div>
          <button
            className={styles.editButton}
            onClick={(event) => openEditExerciseDayDialog(event)}
          >
            EDITAR
          </button>
        </div>
      </div>
    </>
  );
}
