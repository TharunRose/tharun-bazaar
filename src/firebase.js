// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8X0dWWeI0EUrhd1sVBmR4nPPpRWEOF44",
  authDomain: "task-management-a6960.firebaseapp.com",
  projectId: "task-management-a6960",
  storageBucket: "task-management-a6960.firebasestorage.app",
  messagingSenderId: "140314076946",
  appId: "1:140314076946:web:8c1f28b86cb14075da75cb",
  measurementId: "G-ST8B3K0TVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };