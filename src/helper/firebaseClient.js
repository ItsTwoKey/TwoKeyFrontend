// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv4AacvgblE8Z0n2W8zZ9neZaUWp9iT-8",
  authDomain: "twokey-a14ec.firebaseapp.com",
  projectId: "twokey-a14ec",
  storageBucket: "twokey-a14ec.appspot.com",
  messagingSenderId: "432922979523",
  appId: "1:432922979523:web:2519c6b5905fc4249e0676",
  measurementId: "G-9E8DPLH2BC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app, "gs://twokey-a14ec.appspot.com");

export default app;
export { auth, db, storage };
