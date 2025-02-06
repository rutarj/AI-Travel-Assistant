// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_FIREBASE_API_KEY,
  authDomain: "trip-planner-b5bac.firebaseapp.com",
  projectId: "trip-planner-b5bac",
  storageBucket: "trip-planner-b5bac.appspot.com",
  messagingSenderId: "269816847768",
  appId: "1:269816847768:web:d6c6688ebce8d2de6d5fed",
  measurementId: "G-DY35M7YLL3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);