import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiYcdCglbSWo8wA0ReGS31XVPgdZ1YqQ4",
  authDomain: "kwaitube---database.firebaseapp.com",
  projectId: "kwaitube---database",
  storageBucket: "kwaitube---database.firebasestorage.app",
  messagingSenderId: "826878719350",
  appId: "1:826878719350:web:bbf2149b10059bba9a3657",
  measurementId: "G-KGRNW4C9TZ"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);