import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddExerciseLog from '../../components/add-dialogs/add-exercise-log/add-exercise-log';
import { addService } from '../../components/back-button/footer';
import CardText from '../../components/card-text/card-text';
import LogElement from '../../components/log/log-element';
import {
  addLog,
  getExerciseDay,
  getLogs,
  removeLog,
} from '../../db/routine.db';
import { ExerciseDay, Log } from '../../model/routine.model';
import styles from './exercise-day-page.module.scss';

export default function ExerciseDayPage() {
  const { routineId, exerciseDayId } = useParams();
  const [exerciseDay, setExerciseDay] = useState<ExerciseDay>();
  const [logs, setLogs] = useState<Log[]>();
  const [addExerciseLogDialog, setAddExerciseLogDialog] =
    useState<JSX.Element>();
  const onExitDialog = (sucess: boolean, exerciseLog?: Log) => {
    if (sucess && exerciseLog) {
      addLog(exerciseLog);
      loadLogs();
    }
    setAddExerciseLogDialog(<></>);
  };
  const loadExerciseDay = () => {
    if (routineId && exerciseDayId) {
      getExerciseDay(routineId, exerciseDayId).subscribe((ed) => {
        if (ed) {
          setExerciseDay(ed);
        }
      });
    } else {
      throw new Error('Wrong routine or exercise day id');
    }
  };
  const loadLogs = () => {
    if (exerciseDayId) {
      getLogs(exerciseDayId).subscribe((logs) => {
        if (logs) {
          logs = logs.sort((a, b) => a.date - b.date);
          setLogs(logs);
        }
      });
    } else {
      throw new Error('Wrong exercise day id');
    }
  };
  const logElements = logs?.map((l, index, collection) => (
    <LogElement
      onClick={(l) => {
        setAddExerciseLogDialog(
          <AddExerciseLog
            onExit={onExitDialog}
            log={l}
            exerciseDay={exerciseDay!}
          ></AddExerciseLog>
        );
      }}
      onRemoveClick={() => {
        removeLog(l).subscribe(() => loadLogs());
      }}
      exerciseDay={exerciseDay!}
      log={l}
      previousLog={index > 0 ? collection[index - 1] : undefined}
    ></LogElement>
  ));

  useEffect(() => {
    loadExerciseDay();
    loadLogs();
  }, []);

  useEffect(() => {
    addService.addFunction = () => {
      if (!exerciseDay) return;
      setAddExerciseLogDialog(
        <AddExerciseLog
          onExit={onExitDialog}
          exerciseDay={exerciseDay}
        ></AddExerciseLog>
      );
    };
  }, [exerciseDay]);
  return (
    <div className={styles.container}>
      <h1>Día de {exerciseDay?.name}</h1>
      <div className={styles.logElementsContainer}>
        {logElements?.length !== 0 ? (
          logElements
        ) : (
          <CardText text="No hay logs de ejercicio. Ponte a entrenar"></CardText>
        )}
      </div>
      {addExerciseLogDialog}
    </div>
  );
}
