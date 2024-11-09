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

    const signUpWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result; 
    };

    const signInUser = async () => {
        const auth = getAuth(); 
        const provider = new GoogleAuthProvider();
    
        try {
            const result = await signInWithPopup(auth, provider); 
            console.log("Sign-in result:", result); 
            return result; 
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            throw error; 
        }
    };


    const signInUserEmail = async (email, password) => {
        const auth = getAuth();
        const result = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        return result; 
    };

    return (
        <FirebaseContext.Provider value = {{ signupUserWithEmailAndPassword, putData, signUpWithGoogle, signInUser , signInUserEmail }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
