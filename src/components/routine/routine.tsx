import { useNavigate } from 'react-router-dom';
import { Routine } from '../../model/routine.model';
import styles from './routine.module.scss';

interface RoutineProps {
  routine: Routine;
  onDeleteClick: () => void;
}

export default function RoutineElement(props: RoutineProps) {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <button className="delete" onClick={props.onDeleteClick}>
        <span className="material-symbols-outlined">delete</span>
      </button>
      <div onClick={() => navigate(`/routine/${props.routine.id}`)}>
        <h2>{props.routine.name}</h2>
        <span>
          Created on {new Date(props.routine.createdOn).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
