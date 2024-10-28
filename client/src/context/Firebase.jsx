import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB8e7edbNW8TJ_ympEjxEJlEYJ9Zz_EeTs",
    authDomain: "meetspot-a25e9.firebaseapp.com",
    projectId: "meetspot-a25e9",
    storageBucket: "meetspot-a25e9.appspot.com",
    messagingSenderId: "863223845192",
    appId: "1:863223845192:web:8e04c0072ef286c95aa37d",
    measurementId: "G-7EFJ9NMWWZ",
    databaseURL: "https://meetspot-a25e9-default-rtdb.firebaseio.com"
  };

const FirebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(FirebaseApp);
const FirebaseAuth = getAuth(FirebaseApp);
const GoogleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {

    const signupUserWithEmailAndPassword = (email,password) => {
        return createUserWithEmailAndPassword(FirebaseAuth, email, password)
    }

    const putData = (key,data) => set(ref(database,key),data);

    const signUpWithGoogle = () => {
        signInWithPopup(FirebaseAuth,GoogleProvider);        
    }

    const signInUser = () => {
        signInWithEmailAndPassword(FirebaseAuth, email, password);
    }

    return (
        <FirebaseContext.Provider value = {{ signupUserWithEmailAndPassword, putData, signUpWithGoogle, signInUser }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
