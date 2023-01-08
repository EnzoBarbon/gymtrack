import { ExerciseDay, Log } from '../../model/routine.model';
import styles from './log-element.module.scss';

interface LogElementProps {
  log: Log;
  previousLog?: Log;
  onClick: (log: Log) => void;
  onRemoveClick: () => void;
  exerciseDay?: ExerciseDay;
}

const getSetDifference = (log: Log, previousLog: Log, exerciseId: string) => {
  const diff =
    log.exerciseLogs.find((e) => e.exerciseId === exerciseId)!.sets.length -
    previousLog.exerciseLogs.find((e) => e.exerciseId === exerciseId)!.sets
      .length;
  if (diff === 0) return <></>;
  if (diff < 0) {
    return <span className={styles.badHint}>{diff} set</span>;
  }
  return <span className={styles.goodHint}>+{diff} set</span>;
};

const getRepDifference = (
  log: Log,
  previousLog: Log,
  exerciseId: string,
  setIndex: number
) => {
  const currSets = log.exerciseLogs.find(
    (e) => e.exerciseId === exerciseId
  )!.sets;
  const prevSets = previousLog.exerciseLogs.find(
    (e) => e.exerciseId === exerciseId
  )!.sets;
  // there is no same set in the two logs
  if (setIndex > currSets.length - 1 || setIndex > prevSets.length - 1) {
    return <></>;
  }
  const diff = (currSets[setIndex].reps ?? 0) - (prevSets[setIndex].reps ?? 0);
  if (diff === 0) return <></>;
  if (diff > 0) {
    return (
      <span className={`${styles.goodHint} ${styles.repHint}`}>
        +{diff} rep
      </span>
    );
  }
  return (
    <span className={`${styles.badHint} ${styles.repHint}`}>{diff} rep</span>
  );
};

const getKgsDifference = (
  log: Log,
  previousLog: Log,
  exerciseId: string,
  setIndex: number
) => {
  const currSets = log.exerciseLogs.find(
    (e) => e.exerciseId === exerciseId
  )!.sets;
  const prevSets = previousLog.exerciseLogs.find(
    (e) => e.exerciseId === exerciseId
  )!.sets;
  // there is no same set in the two logs
  if (setIndex > currSets.length - 1 || setIndex > prevSets.length - 1) {
    return <></>;
  }
  const diff = (currSets[setIndex].kgs ?? 0) - (prevSets[setIndex].kgs ?? 0);
  if (diff === 0) return <></>;
  const percentage =
    (prevSets[setIndex].kgs ?? 0) / (currSets[setIndex].kgs ?? 0);
  if (diff > 0) {
    return (
      <span className={`${styles.goodHint} `}>
        +{((1 - percentage) * 100).toFixed(0)}% kg
      </span>
    );
  }
  return (
    <span className={`${styles.badHint} `}>
      {((1 - percentage) * 100).toFixed(0)}% kg
    </span>
  );
};

export default function LogElement(props: LogElementProps) {
  const date = new Date(props.log.date);
  const logElements = props.log.exerciseLogs.map((e) => {
    const sets = e.sets.map((set, setIndex) => (
      <div>
        <span>
          {set.reps} x {set.kgs}{' '}
          {props.previousLog
            ? getRepDifference(
                props.log,
                props.previousLog,
                e.exerciseId,
                setIndex
              )
            : ''}
          {props.previousLog
            ? getKgsDifference(
                props.log,
                props.previousLog,
                e.exerciseId,
                setIndex
              )
            : ''}
        </span>
      </div>
    ));
    const exerciseName = props.exerciseDay
      ? props.exerciseDay.exercises.find((ex) => ex.id === e.exerciseId)?.name
      : e.exerciseId;
    const result = (
      <div>
        <h3>
          {exerciseName}{' '}
          {props.previousLog
            ? getSetDifference(props.log, props.previousLog, e.exerciseId)
            : ''}
        </h3>
        <hr></hr>
        {sets}
      </div>
    );
    return result;
  });
  return (
    <div className={styles.container}>
      <h2>{date.toLocaleDateString()}</h2>
      {logElements}
      <button
        className={styles.editButton}
        onClick={() => props.onClick(props.log)}
      >
        EDITAR
      </button>
      <button
        className={styles.removeButton}
        onClick={() => props.onRemoveClick()}
      >
        BORRAR
      </button>
    </div>
  );
}
