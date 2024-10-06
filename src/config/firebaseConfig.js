import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqqclcFVcyaO4fy_Goi7drizimCPcH7Vs",
  authDomain: "supermarket-e1be6.firebaseapp.com",
  projectId: "supermarket-e1be6",
  storageBucket: "supermarket-e1be6.appspot.com",
  messagingSenderId: "815530222360",
  appId: "1:815530222360:web:83f96470dfffd1b72a346d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const FIREBASE_AUTH = getAuth(app);


export { db, FIREBASE_AUTH };