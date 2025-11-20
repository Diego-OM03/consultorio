// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCV4Q636DJEZKw-w6OUt-jXrQEg6UcabvA",
  authDomain: "consultorio-757c8.firebaseapp.com",
  projectId: "consultorio-757c8",
  storageBucket: "consultorio-757c8.appspot.com", // 👈 Asegúrate que termina en .appspot.com
  messagingSenderId: "69670335993",
  appId: "1:69670335993:web:30ce5bdb70a8e59652b928",
  measurementId: "G-NX4SVZBM80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
