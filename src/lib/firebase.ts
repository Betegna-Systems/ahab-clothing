import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7CDdONptPI04-sl2Or1pBYLXkyXlkZkg",
  authDomain: "ahab-clothing-9baef.firebaseapp.com",
  projectId: "ahab-clothing-9baef",
  storageBucket: "ahab-clothing-9baef.firebasestorage.app",
  messagingSenderId: "833786766800",
  appId: "1:833786766800:web:7eb31530c7a9981188c5d5",
  measurementId: "G-81XV0C6FEF",
};

// Initialize only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
export const db = getFirestore(app);
