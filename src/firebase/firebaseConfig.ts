// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_LV1u1DUwH4_L9YsgWSeNXyuZu0blBak",
  authDomain: "mini-proyecto3-460dc.firebaseapp.com",
  projectId: "mini-proyecto3-460dc",
  storageBucket: "mini-proyecto3-460dc.appspot.com",
  messagingSenderId: "861833654330",
  appId: "1:861833654330:web:cfe79bae95f74e22fd8503",
  measurementId: "G-P79HXZ3SMF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();

export const facebookProvider = new FacebookAuthProvider();
// No hace falta custom parameters para Facebook



