import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc0dK8i10rHktJ2Oq7uHhBOw-z-5BiGGQ",
  authDomain: "massi-assessment.firebaseapp.com",
  databaseURL: "https://massi-assessment-default-rtdb.firebaseio.com",
  projectId: "massi-assessment",
  storageBucket: "massi-assessment.appspot.com",   // (Fixed this too)
  messagingSenderId: "276722086538",
  appId: "1:276722086538:web:ada7102c941aaedfd5f373",
  measurementId: "G-HZEH0VX5M5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };