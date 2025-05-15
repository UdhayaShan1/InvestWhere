// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtWa7z0KfCrDW5O4YtiMerxggETPq1JcY",
  authDomain: "investwhere-20d4c.firebaseapp.com",
  projectId: "investwhere-20d4c",
  storageBucket: "investwhere-20d4c.firebasestorage.app",
  messagingSenderId: "755205180031",
  appId: "1:755205180031:web:9d2c8f992166ef5002cd4a",
  measurementId: "G-XLL1ZWD8TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
