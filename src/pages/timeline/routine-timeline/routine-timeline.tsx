import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Routine, LogWithDate } from '../../../model/routine.model';
import css from './routine-timeline.module.scss';

interface RoutineTimelineProps {
  routine: Routine;
  routineLogs: LogWithDate[];
}

function RoutineTimeline(props: RoutineTimelineProps) {
  const [oldestLogDate, setOldestLogDate] = useState<number>();
  const [currentDate, setCurrentDate] = useState<number>(new Date().getTime());
  const [headDate, setHeadDate] = useState<number>(new Date().getTime());
  const containerRef = useRef<HTMLDivElement>(null);
  let startX = useRef(0);
  let currentX = useRef(0);
  const deltaX = useRef(0);

  useEffect(() => {
    if (props.routineLogs && props.routineLogs.length > 0) {
      const oldestLog = props.routineLogs[props.routineLogs.length - 1];
      setOldestLogDate(oldestLog.date.getTime());
    }
  }, [props.routineLogs]);

  const handleTouchStart = (event: TouchEvent) => {
    startX.current = event.touches[0].clientX;
    currentX.current = startX.current;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    //left is positive so invert the value
    deltaX.current += currentX.current - startX.current;
  };
  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    currentX.current = event.touches[0].clientX;
    //left is positive so invert the value
    const deltaXOffset = currentX.current - startX.current;
    console.log(deltaX, 'deltaX');
    const newHeadDate = headDate - (deltaX.current + deltaXOffset) * 3000000;
    // Use deltaX for your custom logic, such as updating the position of elements

    setHeadDate(newHeadDate);
  };

  useEffect(() => {}, [headDate]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);

  const routine = props.routine;
  const routineLogs = props.routineLogs;

  const dateOffset = 10 * 24 * 60 * 60 * 1000;
  const headMinusOffset = headDate - dateOffset;

  const routineLogsInTimeFrame = routineLogs?.filter((l) => {
    return l.date.getTime() > headMinusOffset;
  });

  const middleDate = new Date(headMinusOffset + dateOffset / 2);
  const middleDateMonth = middleDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const clips: JSX.Element[] = [];
  let closestDate = { diff: Number.MAX_VALUE, logId: '' };
  if (routineLogsInTimeFrame) {
    closestDate = routineLogsInTimeFrame.reduce((acc, l) => {
      const absDiff = Math.abs(l.date.getTime() - middleDate.getTime());
      if (absDiff < acc.diff) {
        acc = { diff: absDiff, logId: l.id };
      }
      return acc;
    }, closestDate);
    console.log(closestDate, 'closestDate');
  }
  routineLogsInTimeFrame?.forEach((l) => {
    const leftPercentage =
      ((l.date.getTime() - headMinusOffset) / (headDate - headMinusOffset)) *
      100;
    const name = routine.exerciseDays?.find(
      (ed) => ed.id === l.exerciseDayId
    )?.name;
    const monthDate = l.date.getDate().toLocaleString();
    const styles = {
      '--left': `${leftPercentage}%`,
      '--offset': `${name!.length * 5}px`,
    } as CSSProperties;
    const stylesDate = {
      '--left': `${leftPercentage}%`,
      '--offset': `${monthDate!.length * 4}px`,
    } as CSSProperties;
    clips.push(
      <>
        <div className={css.clip} style={styles}>
          {/* <span className="material-symbols-outlined">fitness_center</span> */}
        </div>
        <span className={css.clipDate} style={stylesDate}>
          {monthDate}
        </span>
        {closestDate.logId === l.id && (
          <span className={css.clipName} style={styles}>
            {name}
          </span>
        )}
      </>
    );
  });

  return (
    <div className={css.routineTimelineContainer} ref={containerRef}>
      <h1>{routine.name}</h1>

      <span className={css.hint}>10 days view</span>
      <div className={css.barContainer}>
        {clips}
        <span className={css.middleMonth}>{middleDateMonth}</span>
        <div className={css.bar}></div>
      </div>
    </div>
  );
}

export default RoutineTimeline;

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const formattedDate = `${day}/${month}`;
  return formattedDate;
}
