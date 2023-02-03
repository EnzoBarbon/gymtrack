import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { Routine } from '../../../model/routine.model';
import styles from './add-routine.module.scss';

interface AddRoutineProps {
  onExit: (sucess: boolean, routine?: Routine) => void;
}

export default function AddRoutine(props: AddRoutineProps) {
  const [name, setName] = useState<string>();
  const handleNameChange = (event: any) => {
    const value = event.target.value;
    setName(value);
  };
  const sucessfulExit = () => {
    const userId = getAuth().currentUser?.uid;
    if (!name) return;
    const routine: Routine = {
      id: crypto.randomUUID(),
      name: name,
      createdOn: Date.now(),
      userId: userId!,
    };
    props.onExit(true, routine);
  };
  return (
    <div className="dialogContainer">
      <form>
        <h2>Añadir rutina</h2>
        <input
          type={'text'}
          placeholder="Nombre"
          onChange={(e) => handleNameChange(e)}
        ></input>

        <div className="buttonContainer">
          <button
            className={'close'}
            onClick={(e) => {
              e.preventDefault();
              props.onExit(false);
            }}
          >
            CERRAR
          </button>
          <button className={'save'} onClick={(e) => sucessfulExit()}>
            GUARDAR
          </button>
        </div>
      </form>
    </div>
  );
}
