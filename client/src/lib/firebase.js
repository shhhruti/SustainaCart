// client/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔁 Replace the below config with YOURS from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDOp8FSTW-ibAsMno8vRI7yea64syygePs",
  authDomain: "sustaina-cart.firebaseapp.com",
  projectId: "sustaina-cart",
  storageBucket: "sustaina-cart.firebasestorage.app",
  messagingSenderId: "237009392583",
  appId: "1:237009392583:web:955a6bd3896cd6688affe2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
