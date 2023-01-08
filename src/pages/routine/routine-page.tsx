import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddButton from '../../components/add-button/add-button';
import AddExerciseDay from '../../components/add-dialogs/add-exercise-day/add-exercise-day';
import ExerciseDayElement from '../../components/exerciseDay/exercise-day';
import { addExerciseDay, getRoutineById } from '../../db/routine.db';
import { ExerciseDay, Routine } from '../../model/routine.model';
import styles from './routine-page.module.scss';

export default function RoutinePage() {
  const [routine, setRoutine] = useState<Routine | undefined>();
  const [addDialog, setAddDialog] = useState<JSX.Element>();
  const { id } = useParams();
  const loadRoutine = (id: string) => {
    getRoutineById(id).subscribe((rout) => {
      if (rout) {
        setRoutine(rout);
      }
    });
  };
  const onAddDialogExit = (sucess: boolean, exerciseDay?: ExerciseDay) => {
    if (sucess && exerciseDay) {
      if (!routine)
        throw new Error(
          'Attempted to create exercise day with unfound routine'
        );
      addExerciseDay(routine.name, exerciseDay).subscribe(() => {
        loadRoutine(routine.name);
      });
    }
    setAddDialog(<></>);
  };

  useEffect(() => {
    if (!id) return;
    loadRoutine(id);
  }, []);

  let exerciseDaysElements = [<></>];
  if (routine) {
    exerciseDaysElements = routine.exerciseDays.map((ed) => (
      <ExerciseDayElement
        routineId={routine.id}
        exerciseDay={ed}
      ></ExerciseDayElement>
    ));
  }

  return (
    <div className={styles.container}>
      <h1 style={{ marginTop: 2 + 'rem' }}>La puta rutina de {id} </h1>
      {exerciseDaysElements}
      <AddButton
        action={() =>
          setAddDialog(
            <AddExerciseDay onExit={onAddDialogExit}></AddExerciseDay>
          )
        }
      ></AddButton>
      {addDialog}
    </div>
  );
}
