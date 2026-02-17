// ==================== LOADER GLOBAL ====================
// Funcion para ocultar el loader cuando todos los elementos estén cargados
function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.classList.remove('loader-active');
        loaderContainer.classList.add('loader-inactive');
        // Remover el elemento después de la animación
        setTimeout(() => {
            loaderContainer.style.display = 'none';
        }, 500);
    }
}

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
} else {
    hideLoader();
}

// También esperar a que las imágenes se carguen
window.addEventListener('load', hideLoader);

// ==================== FIN LOADER GLOBAL ====================

const botonInicio = document.querySelector(".btn-inicio");
if (botonInicio) {
  botonInicio.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const botonLogo = document.querySelector(".logo");
if (botonLogo) {
  botonLogo.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const botonCita = document.querySelector("#btn-cita");
if (botonCita) {
  botonCita.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

const pestañaServicios = document.querySelector(".btn-servicios");
if (pestañaServicios) {
  pestañaServicios.addEventListener("click", () => {
    window.location.href = "services.html";
  });
}

const pestañaContacto = document.querySelector(".btn-contacto");
if (pestañaContacto) {
  pestañaContacto.addEventListener("click", () => {
    window.location.href = "contacto.html";
  });
}

const login = document.querySelector(".btn-sesion");
if (login) {
  login.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

const backLogin = document.querySelector("#btn-back");
if (backLogin) {
  backLogin.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}