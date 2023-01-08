import { useState } from 'react';
import {
  ExerciseDay,
  ExerciseLog,
  Log,
  Set,
} from '../../../model/routine.model';
import styles from './add-exercise-log.module.scss';

interface AddExerciseLogProps {
  exerciseDay: ExerciseDay;
  /** Can be passed when updating the log*/
  log?: Log;
  onExit: (sucess: boolean, exerciseLog?: Log) => void;
}

const prepareExerciseLogs = (
  props: AddExerciseLogProps
): { [exerciseId: string]: Set[] } => {
  const dic: { [exerciseId: string]: Set[] } = {};

  props.exerciseDay.exercises.forEach((exercise) => {
    if (!props.log) {
      dic[exercise.id!] = [{ reps: undefined, kgs: undefined }];
    } else {
      const logExercises = props.log.exerciseLogs.find(
        (el) => el.exerciseId === exercise.id
      )?.sets;
      dic[exercise.id!] = logExercises ?? [{ reps: undefined, kgs: undefined }];
    }
  });
  return dic;
};

export default function AddExerciseLog(props: AddExerciseLogProps) {
  const [exerciseLogs, setExerciseLogs] = useState<{
    [exerciseId: string]: Set[];
  }>(prepareExerciseLogs(props));
  const sucessfulExit = (event: any) => {
    event.preventDefault();
    const date = Date.now();
    let eLogs: ExerciseLog[] | undefined = undefined;
    Object.keys(exerciseLogs).forEach((key) => {
      const sets = exerciseLogs[key];
      const exerciseLog: ExerciseLog = { exerciseId: key, sets };
      eLogs ? eLogs.push(exerciseLog) : (eLogs = [exerciseLog]);
    });
    const log: Log = {
      id: props.log ? props.log.id : crypto.randomUUID(),
      date: props.log ? props.log.date : date,
      exerciseLogs: eLogs!,
      exerciseDayId: props.exerciseDay.id!,
    };
    props.onExit(true, log);
  };

  const handleInputChange = (
    event: any,
    exerciseId: string,
    index: number,
    field: 'kgs' | 'reps'
  ) => {
    const value = event.target.value;
    const newDic = { ...exerciseLogs };
    const oldValue = newDic[exerciseId][index];
    if (field === 'kgs') {
      oldValue.kgs = value;
    } else {
      oldValue.reps = value;
    }
    newDic[exerciseId][index] = oldValue;
    setExerciseLogs(newDic);
  };
  const handleAddInput = (event: any, exerciseId: string) => {
    event.preventDefault();
    const newDic = { ...exerciseLogs };
    newDic[exerciseId].push({ reps: undefined, kgs: undefined });
    setExerciseLogs(newDic);
  };
  const exerciseForms = Object.keys(exerciseLogs!).map((exerciseId) => {
    const exercise = props.exerciseDay.exercises.find(
      (e) => e.id === exerciseId
    );
    if (!exercise) throw new Error('Data corrupted.');

    const inputs = exerciseLogs![exerciseId].map((set, index, collection) => {
      const element = (
        <div>
          <input
            type={'number'}
            placeholder="reps"
            onChange={(e) => handleInputChange(e, exerciseId, index, 'reps')}
            value={set.reps ?? ''}
          ></input>
          x
          <input
            type={'number'}
            placeholder="kgs"
            onChange={(e) => handleInputChange(e, exerciseId, index, 'kgs')}
            value={set.kgs ?? ''}
          ></input>
          {index === collection.length - 1 ? (
            <button
              className="addInput"
              onClick={(e) => handleAddInput(e, exerciseId)}
            >
              +
            </button>
          ) : (
            <></>
          )}
        </div>
      );
      return element;
    });

    const element = (
      <div className={styles.exerciseForm}>
        <h3>{exercise.name}</h3>
        {inputs}
        <hr></hr>
      </div>
    );
    return element;
  });

  return (
    <div className={'dialogContainer'}>
      <form>
        <h2>Add exercise log</h2>
        {exerciseForms}
        <div className="buttonContainer">
          <button
            className={'close'}
            onClick={(e) => {
              e.preventDefault();
              props.onExit(false);
            }}
          >
            CLOSE
          </button>
          <button className={'save'} onClick={(e) => sucessfulExit(e)}>
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
}
