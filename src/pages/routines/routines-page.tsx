import styles from "./routines-page.module.scss";
import { useEffect, useState } from "react";
import { addRoutine, getRoutines, removeRoutine } from "../../db/routine.db";
import { Routine } from "../../model/routine.model";
import RoutineElement from "../../components/routine/routine";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { addService, loadService } from "../../components/back-button/footer";
import AddRoutine from "../../components/add-dialogs/add-routine/add-routine";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { NavigationSetter } from "../../components/back-button/navigationService";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [addRoutineDialog, setAddRoutineDialog] = useState<JSX.Element>();

  const loadRoutines = () => {
    getRoutines().subscribe((routines) => {
      if (routines && routines.length > 0) {
        setRoutines(routines);
      }
    });
  };

  const onRoutineDialogExit = (sucess: boolean, routine?: Routine) => {
    if (sucess && routine) {
      addRoutine(routine).subscribe(() => loadRoutines());
    }
    setAddRoutineDialog(<></>);
  };
  useEffect(() => {
    addService.addFunction = () => {
      setAddRoutineDialog(
        <AddRoutine onExit={onRoutineDialogExit}></AddRoutine>
      );
    };
    getAuth().onAuthStateChanged((user) => {
      if (user) loadRoutines();
    });
  }, []);

  const routineElements = routines.map((r) => (
    <RoutineElement
      key={r.name}
      routine={r}
      onDeleteClick={() => {
        removeRoutine(r);
        loadRoutines();
      }}
    ></RoutineElement>
  ));

  return (
    <>
      <div className={styles.container}>
        {routineElements}
        {addRoutineDialog}
      </div>
      {/* //set navigation outisde of the component */}
      <NavigationSetter></NavigationSetter>
    </>
  );
}
