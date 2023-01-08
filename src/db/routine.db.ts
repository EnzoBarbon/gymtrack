import { Routine, ExerciseDay, Log } from './../model/routine.model';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { from, map, mergeMap, Observable } from 'rxjs';
import { db } from '..';

export function getRoutines(): Observable<Routine[]> {
  const querySnapshot = getDocs(collection(db, 'routines'));
  const result = from(querySnapshot).pipe(
    map((snap) => {
      const routines: Routine[] = snap.docs.map((doc) => {
        const rout = doc.data() as Routine;
        rout.id = doc.id;
        return rout;
      });
      return routines;
    })
  );
  return result;
}

export function getRoutineById(id: string): Observable<Routine> {
  const docRef = doc(db, 'routines', id);
  const result = from(getDoc(docRef)).pipe(
    mergeMap((snap) => {
      const routine = snap.data() as Routine;
      routine.id = snap.id;
      return from(
        getDocs(collection(db, 'routines/' + id + '/exerciseDays'))
      ).pipe(
        map((eds) => {
          const exercises = eds.docs.map((exerciseDoc) => {
            const ex = exerciseDoc.data() as ExerciseDay;
            ex.id = exerciseDoc.id;
            return ex;
          });
          routine.exerciseDays = exercises;
          return routine;
        })
      );
    })
  );
  return result;
}

export function addExerciseDay(routineId: string, exerciseDay: ExerciseDay) {
  return from(
    setDoc(
      doc(db, `routines/${routineId}/exerciseDays/${crypto.randomUUID()}`),
      exerciseDay
    )
  );
}
export function addLog(log: Log) {
  return from(setDoc(doc(db, `logs/${log.id}`), log));
}
export function removeLog(log: Log) {
  return from(deleteDoc(doc(db, `logs/${log.id}`)));
}

export function getLogs(exerciseDayId: string) {
  const querySnapshot = getDocs(
    query(collection(db, 'logs'), where('exerciseDayId', '==', exerciseDayId))
  );
  const result = from(querySnapshot).pipe(
    map((snap) => {
      const logs: Log[] = snap.docs.map((doc) => {
        const log = doc.data() as Log;
        log.id = doc.id;
        return log;
      });
      return logs;
    })
  );
  return result;
}

export function getExerciseDay(routineId: string, exerciseDayId: string) {
  const docRef = doc(db, `routines/${routineId}/exerciseDays`, exerciseDayId);
  const result = from(getDoc(docRef)).pipe(
    map((snap) => {
      const day = snap.data() as ExerciseDay;
      day.id = snap.id;
      return day;
    })
  );
  return result;
}
