import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDQuBiOZmdX1JuSzWmHEDFHdBTTTdBU934",
  authDomain: "haeseola-a83de.firebaseapp.com",
  databaseURL: "https://haeseola-a83de-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "haeseola-a83de",
  storageBucket: "haeseola-a83de.firebasestorage.app",
  messagingSenderId: "103075772011",
  appId: "1:103075772011:web:613534af89be2ac84ca32e"
}

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
