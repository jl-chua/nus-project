// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGClXkMdeOcAi23u2vOZLw3r9IwrhLy2g",
  authDomain: "wall2-e5cc9.firebaseapp.com",
  projectId: "wall2-e5cc9",
  storageBucket: "wall2-e5cc9.appspot.com",
  messagingSenderId: "403614849903",
  appId: "1:403614849903:web:5bcf8f3e8199f3fd4ee69a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default getFirestore(app);
