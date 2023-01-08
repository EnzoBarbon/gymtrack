import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import Square from './components/background-props/square/square';
import CircleOutline from './components/background-props/circle-outline/circle-outline';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGrWoGuDu8A-iDnsD9MpKXxO31F7_JD0k',
  authDomain: 'gym-track-72b6e.firebaseapp.com',
  projectId: 'gym-track-72b6e',
  storageBucket: 'gym-track-72b6e.appspot.com',
  messagingSenderId: '513121347548',
  appId: '1:513121347548:web:60dd9c787b06e665acd119',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div
      style={{
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        height: '100%',
        width: '100%',
      }}
    >
      <Square width={22} height={22} right={12} top={-4}></Square>
      <Square width={20} height={20} right={-3} top={2}></Square>
      <CircleOutline
        width={50}
        height={50}
        bottom={-10}
        left={-10}
      ></CircleOutline>
      <Square
        width={22}
        height={22}
        left={7}
        bottom={-12}
        reverse={true}
      ></Square>
      <Square
        width={20}
        height={20}
        left={-7}
        bottom={-4}
        reverse={true}
      ></Square>
    </div>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
