import { auth, db } from "../firebaseConfig.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  // Mostrar/ocultar contraseña
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // Elemento para mostrar errores
  const loginError = document.getElementById("loginError");

  // ============================
  // LOGIN CON CORREO Y CONTRASEÑA
  // ============================
  const formLogin = document.getElementById("form-login");
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = ""; // limpiar mensaje

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    try {
      // Iniciar sesión en Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar usuario en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("El usuario no está registrado en la base de datos.");
      }

      const userData = userSnap.data();
      const nombreUsuario = userData.nombre || email;
      const rol = userData.rol || "paciente"; // por defecto paciente

      alert(`✅ Bienvenido de nuevo, ${nombreUsuario}!`);

      // Guardar sesión local
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("rol", rol);
      localStorage.setItem("nombre", nombreUsuario); // ✅ se agrega aquí

      // Redirigir según el rol
      if (rol === "admin") {
        window.location.href = "../Dashboard/admin/index.html";
      } else if (rol === "medico") {
        window.location.href = "../Dashboard/medico/index.html";
      } else {
        window.location.href = "../Dashboard/pacientes/index.html";
      }

    } catch (error) {
      console.error(error);

      // Manejo de errores
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        loginError.textContent = "❌ Correo o contraseña incorrecta.";
      } else if (error.code === "auth/invalid-email") {
        loginError.textContent = "❌ Correo inválido.";
      } else {
        loginError.textContent = "❌ Error al iniciar sesión.";
      }
    }
  });

  // ============================
  // LOGIN CON GOOGLE
  // ============================
  const googleBtn = document.getElementById("googleLogin");
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Buscar usuario existente
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      let rol = "paciente"; // valor por defecto
      let nombreUsuario = user.displayName;

      if (userSnap.exists()) {
        const data = userSnap.data();
        rol = data.rol || "paciente";
        nombreUsuario = data.nombre || user.displayName;
      } else {
        // Si no existe, lo crea con rol paciente
        await setDoc(userRef, {
          uid: user.uid,
          nombre: user.displayName,
          email: user.email,
          foto: user.photoURL,
          rol: "paciente",
          fechaRegistro: new Date()
        });
      }

      // ✅ Guardamos todo en localStorage
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("rol", rol);
      localStorage.setItem("nombre", nombreUsuario); // ✅ agregado

      // Redirigir según el rol
      if (rol === "admin") {
        window.location.href = "../Dashboard/admin/admin.html";
      } else if (rol === "medico") {
        window.location.href = "../Dashboard/medico/medico.html";
      } else {
        window.location.href = "../Dashboard/pacientes/paciente.html";
      }

    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      loginError.textContent = "❌ Error al iniciar sesión con Google.";
    }
  });
});
