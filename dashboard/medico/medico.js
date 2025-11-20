import { auth } from "../../firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const rol = localStorage.getItem("rol");
  const uid = localStorage.getItem("uid");
  const nombre = localStorage.getItem("nombre") || "Doctor";

  const titulo = document.querySelector("header h1");
  const logoutBtn = document.getElementById("logoutBtn");

  // 🔒 Verificación de sesión y rol
  if (!uid || rol !== "medico") {
    window.location.href = "../../Login/login.html";
    return;
  }

  // 🕒 Crear saludo dinámico
  const hora = new Date().getHours();
  let saludo;
  if (hora < 12) {
    saludo = "☀️ Buenos días";
  } else if (hora < 18) {
    saludo = "🌤️ Buenas tardes";
  } else {
    saludo = "🌙 Buenas noches";
  }

  // 👋 Mostrar saludo personalizado en el título principal
  if (titulo) {
    titulo.textContent = `${saludo}, Dr/a. ${nombre}`;
  }

  // 🚪 Cerrar sesión
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "../../Login/login.html";
  });
});
