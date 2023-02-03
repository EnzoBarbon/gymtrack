import { useState } from 'react';
import { Exercise, ExerciseDay, Routine } from '../../../model/routine.model';
import styles from './add-exercise-day.module.scss';

interface AddExerciseDayProps {
  onExit: (
    sucess: boolean,
    routine: Routine,
    exerciseDay?: ExerciseDay
  ) => void;
  routine: Routine;
  exerciseDay?: ExerciseDay; //if given, it should act as an update
}

const exercisesToDic = (exercises: Exercise[]): { [id: string]: Exercise } => {
  const dic: { [id: string]: Exercise } = {};
  exercises.forEach((e) => {
    dic[e.id!] = e;
  });

  return dic;
};

export default function AddExerciseDay(props: AddExerciseDayProps) {
  const [exercises, setExercises] = useState<{ [id: string]: Exercise }>(
    props.exerciseDay
      ? exercisesToDic(props.exerciseDay.exercises)
      : ({} as { [id: string]: Exercise }) //1
  );
  const [name, setName] = useState<string>(
    props.exerciseDay ? props.exerciseDay.name : ''
  );

  const sucessfulExit = (event: any) => {
    event.preventDefault();
    if (!name || !exercises) return;

    const mappedExercises = Object.keys(exercises).map((key) => {
      const e = exercises[key];
      return {
        ...e,
        name: e.name,
        id: e.id ?? crypto.randomUUID(),
      } as Exercise;
    });
    const exerciseDay: ExerciseDay = {
      id: props.exerciseDay ? props.exerciseDay.id : crypto.randomUUID(),
      name,
      exercises: mappedExercises,
    };
    props.onExit(true, props.routine, exerciseDay);
  };
  const addExercise = (event: any) => {
    event.preventDefault();
    const newExercises = { ...exercises };
    const rndKey = crypto.randomUUID();
    newExercises[rndKey] = { id: rndKey } as Exercise;
    console.log('new exercises', newExercises);
    setExercises(newExercises);
  };

  const renewExercise = (event: any, exerciseKey: string) => {
    event.preventDefault();
    const newExercises = { ...exercises };
    newExercises[exerciseKey] = { ...exercises[exerciseKey], old: false };
    setExercises(newExercises);
  };

  const removeExercise = (event: any, exerciseKey: string) => {
    event.preventDefault();
    const newExercises = { ...exercises };
    newExercises[exerciseKey] = { ...exercises[exerciseKey], old: true };
    setExercises(newExercises);
  };

  const exercisesElements: JSX.Element[] = [];
  const oldExercisesElements: JSX.Element[] = [];
  Object.keys(exercises).forEach((key, index, collection) => {
    const handler = (event: any) => {
      const value = event.target.value;
      console.log('the value is', value);
      const newExercises = { ...exercises };
      newExercises[key] = {
        ...newExercises[key],
        name: value,
      } as Exercise;
      setExercises(newExercises);
    };
    const ex = exercises[key];
    if (ex.old) {
      oldExercisesElements.push(
        <div>
          <span>{ex.name}</span>
          <button
            className={'addInput'}
            onClick={(event) => renewExercise(event, key)}
          >
            +
          </button>
        </div>
      );
    } else {
      exercisesElements.push(
        <div>
          <input type={'text'} value={ex.name} onChange={handler}></input>
          <button
            className={'removeInput'}
            onClick={(event) => removeExercise(event, key)}
          >
            -
          </button>
        </div>
      );
    }
    if (index === collection.length - 1) {
      exercisesElements.push(
        <div>
          <button
            className={'addInput'}
            onClick={(event) => addExercise(event)}
          >
            +
          </button>
        </div>
      );
    }
  });
  if (exercisesElements.length === 0) {
    exercisesElements.push(
      <div>
        <button className={'addInput'} onClick={(event) => addExercise(event)}>
          +
        </button>
      </div>
    );
  }

  const nameChangeHandler = (event: any) => {
    const value = event.target.value;
    setName(value);
  };

  return (
    <div className={'dialogContainer'}>
      <form>
        <h2>{!props.exerciseDay ? 'Añadir' : 'Modificar'} día de rutina</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={nameChangeHandler}
        ></input>
        <h3>Exercises</h3>
        {exercisesElements}
        <h3>Old Exercises</h3>
        {oldExercisesElements}
        <div className={'buttonContainer'}>
          <button
            className={'close'}
            onClick={(e) => {
              e.preventDefault();
              props.onExit(false, props.routine);
            }}
          >
            CERRAR
          </button>
          <button className={'save'} onClick={(e) => sucessfulExit(e)}>
            GUARDAR
          </button>
        </div>
      </form>
    </div>
  );
}
