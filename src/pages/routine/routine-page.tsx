import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddExerciseDay from '../../components/add-dialogs/add-exercise-day/add-exercise-day';
import { addService } from '../../components/back-button/footer';
import CardText from '../../components/card-text/card-text';
import ExerciseDayElement from '../../components/exerciseDay/exercise-day';
import {
  addExerciseDay,
  getRoutineById,
  removeExerciseDay,
} from '../../db/routine.db';
import { ExerciseDay, Routine } from '../../model/routine.model';
import styles from './routine-page.module.scss';

export default function RoutinePage() {
  const [routine, setRoutine] = useState<Routine | undefined>();
  const [addDialog, setAddDialog] = useState<JSX.Element>();
  const { id } = useParams();
  const loadRoutine = (id: string) => {
    getRoutineById(id).subscribe((rout) => {
      console.log('routine result', rout);
      if (rout) {
        setRoutine(rout);
        addService.addFunction = () => {
          setAddDialog(
            <AddExerciseDay
              routine={rout}
              onExit={onAddDialogExit}
            ></AddExerciseDay>
          );
        };
      }
    });
  };
  const onAddDialogExit = (
    sucess: boolean,
    routine: Routine,
    exerciseDay?: ExerciseDay
  ) => {
    console.log('routine when dialog exit');
    if (sucess && exerciseDay) {
      if (!routine)
        throw new Error(
          'Attempted to create exercise day with unfound routine'
        );
      addExerciseDay(routine.id!, exerciseDay).subscribe(() => {
        loadRoutine(routine.id!);
      });
    }
    setAddDialog(<></>);
  };

  useEffect(() => {
    if (!id) return;
    loadRoutine(id);
  }, []);

  let exerciseDaysElements = [<></>];
  if (routine && routine.exerciseDays) {
    exerciseDaysElements = routine.exerciseDays.map((ed) => (
      <ExerciseDayElement
        onRemoveClick={() => {
          removeExerciseDay(routine.id, ed);
          loadRoutine(id!);
        }}
        onEdit={() => loadRoutine(id!)}
        routine={routine!}
        exerciseDay={ed}
      ></ExerciseDayElement>
    ));
  }

  return (
    <div className={styles.container}>
      <h1 style={{ marginTop: 2 + 'rem' }}>Rutina {routine?.name}</h1>
      {exerciseDaysElements.length !== 0 ? (
        exerciseDaysElements
      ) : (
        <CardText text="No existen días de ejercicio todavía. Aniadelos abajo a la derecha"></CardText>
      )}
      {addDialog}
    </div>
  );
}
