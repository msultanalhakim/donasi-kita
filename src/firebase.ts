// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIq2_D9evFN2FQlw2C8RuryDOZ5dOsZlc",
    authDomain: "donasi-kita-f4b46.firebaseapp.com",
    projectId: "donasi-kita-f4b46",
    storageBucket: "donasi-kita-f4b46.firebasestorage.app",
    messagingSenderId: "454263611100",
    appId: "1:454263611100:web:4fa56656da60ef924d9e19",
    measurementId: "G-VXTHVYY7PM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const dataBase = getFirestore(app)

export {
    dataBase,
    auth
}