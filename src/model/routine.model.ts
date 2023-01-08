export interface Routine {
  id: string;
  name: string;
  exerciseDays: ExerciseDay[];
}

export interface ExerciseDay {
  id?: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id?: string;
  name: string;
  description?: string;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: Set[];
}
export interface Set {
  reps?: number;
  kgs?: number;
}

export interface Log {
  id: string;
  date: number;

  exerciseLogs: ExerciseLog[];
  exerciseDayId: string;
}
