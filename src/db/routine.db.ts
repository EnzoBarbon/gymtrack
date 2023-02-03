import { loadService } from './../components/back-button/footer';
import { getAuth } from 'firebase/auth';
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
import { delay, from, map, mergeMap, Observable, tap } from 'rxjs';
import { db } from '..';

export function getRoutines(): Observable<Routine[]> {
  preLoad();
  const userId = getAuth().currentUser?.uid;
  const querySnapshot = getDocs(
    query(collection(db, 'routines'), where('userId', '==', userId))
  );
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
  return postLoad(result);
}

export function getRoutineById(id: string): Observable<Routine> {
  preLoad();
  const docRef = doc(db, 'routines', id);
  const result = from(getDoc(docRef)).pipe(
    mergeMap((snap) => {
      const routine = snap.data() as Routine;
      console.log('q choo', routine);
      routine.id = snap.id;
      return from(
        getDocs(collection(db, 'routines/' + id + '/exerciseDays'))
      ).pipe(
        map((eds) => {
          if (!eds) return routine;
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
  return postLoad(result);
}

export function addExerciseDay(routineId: string, exerciseDay: ExerciseDay) {
  preLoad();
  return postLoad(
    from(
      setDoc(
        doc(db, `routines/${routineId}/exerciseDays/${exerciseDay.id}`),
        exerciseDay
      )
    )
  );
}
export function addRoutine(routine: Routine) {
  preLoad();
  return postLoad(from(setDoc(doc(db, `routines/${routine.id}`), routine)));
}
export function removeRoutine(routine: Routine) {
  preLoad();
  return postLoad(from(deleteDoc(doc(db, `routines/${routine.id}`))));
}

export function addLog(log: Log) {
  preLoad();
  return postLoad(from(setDoc(doc(db, `logs/${log.id}`), log)));
}
export function removeLog(log: Log) {
  preLoad();
  return postLoad(from(deleteDoc(doc(db, `logs/${log.id}`))));
}

export function removeExerciseDay(routineId: string, exerciseDay: ExerciseDay) {
  preLoad();
  return postLoad(
    from(
      deleteDoc(doc(db, `routines/${routineId}/exerciseDays/${exerciseDay.id}`))
    )
  );
}

export function getLogs(exerciseDayId: string) {
  preLoad();
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
  return postLoad(result);
}

export function getExerciseDay(routineId: string, exerciseDayId: string) {
  preLoad();
  const docRef = doc(db, `routines/${routineId}/exerciseDays`, exerciseDayId);
  const result = from(getDoc(docRef)).pipe(
    map((snap) => {
      const day = snap.data() as ExerciseDay;
      day.id = snap.id;
      return day;
    })
  );
  return postLoad(result);
}

function postLoad<T>(observable: Observable<T>) {
  observable = observable.pipe(tap(() => loadService.loading.next(false)));
  return observable;
}
function preLoad() {
  loadService.loading.next(true);
}
