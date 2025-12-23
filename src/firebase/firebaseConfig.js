// src/firebase/firebaseConfig.js
// Replace the firebaseConfig object values with your project values from Firebase console
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY",
  authDomain: "amahaapp.firebaseapp.com",
  projectId: "amahaapp",
  storageBucket: "amahaapp.firebasestorage.app",
  messagingSenderId: "972893258212",
  appId: "1:972893258212:web:1f9a54fa450805ab2647f1"
  // (Add other fields if the console shows them)
};

// initialize app
const app = initializeApp(firebaseConfig);

// firestore DB
const db = getFirestore(app);

// auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// storage
const storage = getStorage(app);

export { app, db, auth, googleProvider, storage };