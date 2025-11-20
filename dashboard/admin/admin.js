import { auth, db } from "../firebaseConfig.js";
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const welcome = document.getElementById('welcome');
  const cardsContainer = document.getElementById('cards');
  const searchInput = document.getElementById('search');

  const userName = "Administrador";
  const userRole = "admin";

  // ---------------------------
  // Sidebar dinámico
  // ---------------------------
  function generarSidebar() {
    welcome.textContent = `Bienvenido ${userName}`;
    sidebar.innerHTML = `
      <h2>Administrador</h2>
      <a href="#" class="nav-link" data-page="users">Usuarios</a>
      <a href="#" class="nav-link" data-page="reports">Reportes</a>
      <a href="#" class="nav-link" data-page="settings">Configuración</a>
    `;
  }

  // ---------------------------
  // Estadísticas rápidas
  // ---------------------------
  async function mostrarCards() {
    try {
      const usersRef = collection(db, "usuarios");
      const snapshot = await getDocs(usersRef);

      const totalUsuarios = snapshot.size;
      const totalMedicos = snapshot.docs.filter(d => d.data().rol === "medico").length;
      const totalPacientes = snapshot.docs.filter(d => d.data().rol === "paciente").length;

      cardsContainer.innerHTML = `
        <div class="card">Usuarios: ${totalUsuarios}</div>
        <div class="card">Médicos: ${totalMedicos}</div>
        <div class="card">Pacientes: ${totalPacientes}</div>
      `;
    } catch (error) {
      cardsContainer.innerHTML = `<p>Error al cargar estadísticas: ${error.message}</p>`;
    }
  }

  // ---------------------------
  // Tabla de usuarios
  // ---------------------------
  let usuariosCache = []; // para filtrar

  async function mostrarUsuarios() {
    content.innerHTML = '<h3>Usuarios registrados</h3>';
    try {
      const usersRef = collection(db, "usuarios");
      const snapshot = await getDocs(usersRef);

      if (snapshot.empty) {
        content.innerHTML += "<p>No hay usuarios registrados.</p>";
        return;
      }

      usuariosCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      renderTabla(usuariosCache);

    } catch (error) {
      content.innerHTML += `<p>Error al cargar usuarios: ${error.message}</p>`;
    }
  }

  function renderTabla(usuarios) {
    let table = `<table>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>`;

    usuarios.forEach(u => {
      table += `<tr>
        <td>${u.nombre || ''}</td>
        <td>${u.email || ''}</td>
        <td>${u.rol || ''}</td>
        <td>
          <button class="edit" data-id="${u.id}">Editar</button>
          <button class="delete" data-id="${u.id}">Eliminar</button>
        </td>
      </tr>`;
    });

    table += "</table>";
    content.innerHTML = table;
  }

  // ---------------------------
  // Delegación de eventos para sidebar
  // ---------------------------
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;

    if (page === "users") mostrarUsuarios();
    if (page === "reports") mostrarCards(); // muestra cards como reportes
    if (page === "settings") content.innerHTML = '<h3>Configuración</h3><p>Aquí puedes ajustar parámetros del sistema.</p>';
  });

  // ---------------------------
  // Delegación de eventos para tabla (editar/eliminar)
  // ---------------------------
  content.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit');
    const deleteBtn = e.target.closest('.delete');

    if (editBtn) {
      const id = editBtn.dataset.id;
      alert(`Editar usuario con ID: ${id} (aquí puedes abrir un modal)`);
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        try {
          await deleteDoc(doc(db, "usuarios", id));
          alert("Usuario eliminado correctamente");
          mostrarUsuarios(); // refresca la tabla
        } catch (error) {
          alert("Error al eliminar usuario: " + error.message);
        }
      }
    }
  });

  // ---------------------------
  // Filtro de búsqueda
  // ---------------------------
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = usuariosCache.filter(u => (u.nombre || '').toLowerCase().includes(query));
    renderTabla(filtered);
  });

  // ---------------------------
  // Inicialización
  // ---------------------------
  generarSidebar();
  mostrarCards();

});
