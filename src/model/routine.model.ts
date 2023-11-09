export interface Routine {
  id: string;
  name: string;
  createdOn: number;
  userId: string;
  exerciseDays?: ExerciseDay[];
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
  old?: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets?: Set[];
}
export interface Set {
  reps?: number;
  kgs?: number;
}

export interface Log {
  id: string;
  note?: string;
  date: number;

  exerciseLogs: ExerciseLog[];
  exerciseDayId: string;
}

export interface LogWithDate {
  id: string;
  note?: string;
  numberDate: number;
  date: Date;
  exerciseDayId: string;
}
