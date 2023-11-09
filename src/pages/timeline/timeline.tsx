import { useEffect, useState } from 'react';
import { LogWithDate, Routine } from '../../model/routine.model';
import {
  getLogsByExerciseDays,
  getRoutineById,
  getRoutines,
} from '../../db/routine.db';
import { firstValueFrom } from 'rxjs';
import css from './timeline.module.scss';
import RoutineTimeline from './routine-timeline/routine-timeline';

interface TimelineProps {}
function Timeline(props: TimelineProps) {
  const [fullRoutineDic, setFullRoutineDic] = useState<{
    [id: string]: Routine;
  }>({});
  const [logs, setLogs] = useState<{ [routineId: string]: LogWithDate[] }>({});

  useEffect(() => {
    getRoutines().subscribe((routines) => {
      if (routines && routines.length > 0) {
        routines.forEach((r) => {
          if (!r.id) return;
          firstValueFrom(getRoutineById(r.id)).then((routine) => {
            if (routine) {
              const newDic = { ...fullRoutineDic };
              newDic[routine.id] = routine;
              setFullRoutineDic(newDic);
              if (!routine.exerciseDays) return;
              firstValueFrom(
                getLogsByExerciseDays(
                  routine.exerciseDays?.map((ed) => ed.id!)!
                )
              ).then((logs) => {
                const indexed = logs
                  .map((l) => {
                    const logWithDate: LogWithDate = {
                      id: l.id,
                      date: new Date(l.date),
                      numberDate: l.date,
                      note: l.note,
                      exerciseDayId: l.exerciseDayId,
                    };
                    return logWithDate;
                  })
                  .sort((a, b) => {
                    return b.date.getTime() - a.date.getTime();
                  });
                setLogs({ [routine.id]: indexed });
              });
            }
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(logs, 'se actualizaron los logos');
  }, [logs]);

  return <div>{getRoutineElements(fullRoutineDic, logs)}</div>;
}

export default Timeline;

function getRoutineElements(
  routines: {
    [id: string]: Routine;
  },
  logs: { [routineId: string]: LogWithDate[] }
): JSX.Element[] {
  const elements: JSX.Element[] = [];
  Object.keys(routines).forEach((rKey) => {
    const routine = routines[rKey];
    const routineLogs = logs[rKey];
    elements.push(
      <RoutineTimeline
        routine={routine}
        routineLogs={routineLogs}
      ></RoutineTimeline>
    );
  });
  return elements;
}
