import { auth, db } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  // Mostrar/ocultar contraseña
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // Registro con correo
  const formRegister = document.getElementById("form-register");
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos en Firestore con rol = paciente
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre,
        email,
        rol: "paciente",
        fechaRegistro: new Date()
      });

      alert(`✅ Registro exitoso. ¡Bienvenido, ${nombre}!`);
      window.location.href = "../Login/login.html";

    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        alert("❌ Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        alert("❌ Correo inválido.");
      } else if (error.code === "auth/weak-password") {
        alert("❌ La contraseña debe tener al menos 6 caracteres.");
      } else {
        alert("❌ Error: " + error.message);
      }
    }
  });

  // Registro con Google
  const googleBtn = document.getElementById("googleRegister");
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Guardar/actualizar usuario con rol paciente
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL,
        rol: "paciente",
        fechaRegistro: new Date()
      }, { merge: true });

      alert(`✅ Registro exitoso. ¡Bienvenido, ${user.displayName}!`);
      window.location.href = "../Login/login.html";

    } catch (error) {
      console.error("Error al registrarse con Google:", error);
      alert("❌ Error: " + error.message);
    }
  });
});
