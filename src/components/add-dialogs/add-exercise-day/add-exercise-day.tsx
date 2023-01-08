import { useState } from 'react';
import { Exercise, ExerciseDay } from '../../../model/routine.model';
import styles from './add-exercise-day.module.scss';

interface AddExerciseDayProps {
  onExit: (sucess: boolean, exerciseDay?: ExerciseDay) => void;
}

export default function AddExerciseDay(props: AddExerciseDayProps) {
  const [exercises, setExercises] = useState<string[]>(['holis']);
  const [name, setName] = useState<string>();

  const sucessfulExit = (event: any) => {
    event.preventDefault();
    if (!name || !exercises) return;
    const mappedExercises = exercises.map((e) => {
      return { name: e, id: crypto.randomUUID() } as Exercise;
    });
    const exerciseDay: ExerciseDay = {
      name,
      exercises: mappedExercises,
    };
    props.onExit(true, exerciseDay);
  };
  const addExercise = () => {
    const newExercises = [...exercises];
    newExercises.push('');
    setExercises(newExercises);
  };

  const exercisesElements = exercises.map((ex, index, collection) => {
    const handler = (event: any) => {
      const value = event.target.value;
      console.log('the value is', value);
      const newExercises = [...exercises];
      newExercises[index] = value;
      setExercises(newExercises);
    };
    if (index === collection.length - 1) {
      return (
        <div>
          <input type={'text'} value={ex} onChange={handler}></input>
          <button className={'addInput'} onClick={addExercise}>
            +
          </button>
        </div>
      );
    }
    return <input type={'text'} value={ex} onChange={handler}></input>;
  });

  const nameChangeHandler = (event: any) => {
    const value = event.target.value;
    setName(value);
  };

  return (
    <div className={'dialogContainer'}>
      <form>
        <h2>Add exercise day</h2>
        <input
          type="text"
          placeholder="Name"
          onChange={nameChangeHandler}
        ></input>
        <h3>Exercises</h3>
        {exercisesElements}
        <div className={'buttonContainer'}>
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
