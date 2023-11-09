import styles from './routines-page.module.scss';
import { useEffect, useState } from 'react';
import { addRoutine, getRoutines, removeRoutine } from '../../db/routine.db';
import { Routine } from '../../model/routine.model';
import RoutineElement from '../../components/routine/routine';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { addService, loadService } from '../../components/back-button/footer';
import AddRoutine from '../../components/add-dialogs/add-routine/add-routine';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { NavigationSetter } from '../../components/back-button/navigationService';

export const signInWithGoogle = async () => {
  // 1. Create credentials on the native layer
  const result = await FirebaseAuthentication.signInWithGoogle();
  // 2. Sign in on the web layer using the id token
  const credential = GoogleAuthProvider.credential(result.credential?.idToken);
  const auth = getAuth();
  await signInWithCredential(auth, credential);
};
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
    const auth = getAuth();
    if (auth.currentUser) {
      loadRoutines();
      return;
    }
    loadService.loading.next(true);
    signInWithGoogle().then((usr) => {
      console.log('Logged in!', usr);
      loadService.loading.next(false);
      loadRoutines();
    });

    // const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider)
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential?.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     console.log('user is ', user);
    //     loadRoutines();
    //     // ...
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });
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
