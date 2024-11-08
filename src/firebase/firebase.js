// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUdhdtI-kFaGBS-XK7q6JaWC6mm2WZJBs",
  authDomain: "fittrack-60e39.firebaseapp.com",
  databaseURL: "https://fittrack-60e39-default-rtdb.firebaseio.com",
  projectId: "fittrack-60e39",
  storageBucket: "fittrack-60e39.firebasestorage.app",
  messagingSenderId: "618974358536",
  appId: "1:618974358536:web:0e39957bec97ccd9e635bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
