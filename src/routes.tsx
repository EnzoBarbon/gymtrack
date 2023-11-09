import { createBrowserRouter } from 'react-router-dom';
import ExerciseDayPage from './pages/exercise-day/exercise-day-page';
import RoutinePage from './pages/routine/routine-page';
import RoutinesPage from './pages/routines/routines-page';
import Timeline from './pages/timeline/timeline';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutinesPage></RoutinesPage>,
  },
  {
    path: '/routine/:id',
    element: <RoutinePage></RoutinePage>,
  },
  {
    path: '/routine/:routineId/day/:exerciseDayId',
    element: <ExerciseDayPage></ExerciseDayPage>,
  },
  {
    path: '/timeline',
    element: <Timeline></Timeline>,
  },
]);
