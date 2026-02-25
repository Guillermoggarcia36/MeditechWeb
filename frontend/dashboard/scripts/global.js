    /* Loader: oculta la pantalla de carga cuando la página termine de cargar */
    function hideLoader() {
        const loader = document.getElementById('loader-container');
        if (!loader) return;
        loader.classList.remove('loader-active');
        loader.classList.add('loader-inactive');
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
    }

    // Oculta el loader cuando se cargue el contenido completo
    document.addEventListener('DOMContentLoaded', () => {
        // Por si acaso el recurso tarda, garantizamos que se intente ocultar al cargar DOM
        setTimeout(hideLoader, 800);
    });
    window.addEventListener('load', hideLoader);

    function actualizarFechaHora() {
        const ahora = new Date();

        const opcionesHora = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const hora = ahora.toLocaleTimeString('es-ES', opcionesHora);

        const opcionesFecha = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);

        document.getElementById("date").textContent = fecha;

        const horaElemento = document.getElementById("time");
        horaElemento.textContent = hora;

        horaElemento.style.animation = "none"; 
        void horaElemento.offsetWidth;
        horaElemento.style.animation = "FadeIn 0.6s ease-in";
    }

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

const optionsContainer = document.getElementById("user-options");

//Nombres y apellidos de usuario logeado
const nombreUsuario = localStorage.getItem("nameUser");
const apellidoUsuario = localStorage.getItem("apellidoUser");

const datosUsuario = [
  nombreUsuario,
  apellidoUsuario
].join (" ");

const userOptions = document.getElementById("btn-user");

//Insersión de datos de usuario logeado para visualizarlos en dashboard
const user = document.getElementById("name-user");
if (datosUsuario) {
    const p = document.createElement("p");
    p.textContent = datosUsuario;
    user.appendChild(p);
};

userOptions.addEventListener("click", () => {
    // Toggle: si está oculto, mostrar; si está visible, ocultar
    if (optionsContainer.style.display === "block") {
        optionsContainer.style.display = "none";
        userOptions.style.backgroundColor = "#FFF";
    } else {
        optionsContainer.style.display = "block";
        userOptions.style.backgroundColor = "#3f3e3e51";
    }
});

const logOutBtn = document.getElementById("logOut");

logOutBtn.addEventListener("click", () => {
    // Limpiar almacenamiento
    localStorage.clear();

    // Mostrar Swal
    Swal.fire({
        title: 'Cerrando sesión...',
        showConfirmButton: false,
        timer: 2000,               // 2 segundos
        timerProgressBar: true,
        allowOutsideClick: false,
        willOpen: () => {
            Swal.showLoading();    // animación opcional
        }
    }).then(() => {
        // Redirigir después de que Swal se cierre
        window.location.href = "../../frontend/main/index.html";
    });
});

const btnInicio = document.getElementById("inicio-btn")
btnInicio.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "dashboard-main.html";
    }, 150);
});

const userContainer = document.getElementById("content-container");

const btnUser = document.getElementById("usuarios-btn")
btnUser.addEventListener("click", () => {   
    setTimeout(() => {
        window.location.href = "dashboard-usuarios.html";
    }, 150); // 150 ms para que se note
    userContainer.style.setProperty("--sombreado-color", "rgba(128, 128, 128, 0.171)")
});

const btnCitas = document.getElementById("citas-btn")
btnCitas.addEventListener("click", () => {   
    setTimeout(() => {
        window.location.href = "dashboard-citas.html";
    }, 150); // 150 ms para que se note
});

const btnHistorial = document.getElementById("historial-btn")
btnHistorial.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "dashboard-historial.html";
    }, 150); // 150 ms para que se note
});

const btnInventario = document.getElementById("inventario-btn")
btnInventario.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "dashboard-inventario.html";
    }, 150); // 150 ms para que se note
});

const btnAutorizaciones = document.getElementById("autorizaciones-btn")
btnAutorizaciones.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "dashboard-autorizaciones.html";
    }, 150); // 150 ms para que se note
});

// ============================================
// ✅ INTERCEPTOR GLOBAL PARA ERRORES 401
// ============================================
// Este código intercepta TODAS las llamadas fetch y verifica errores 401
// Si el servidor responde con 401, cierra sesión automáticamente

// Guardar el fetch original
const originalFetch = window.fetch;

// Sobrescribir fetch global
window.fetch = function(...args) {
    return originalFetch.apply(this, args)
        .then(response => {
            // Si la respuesta es 401 (no autorizado), cerrar sesión
            if (response.status === 401) {
                console.error('⛔ Error 401: No autorizado. Cerrando sesión...');
                
                // Limpiar localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('nameUser');
                localStorage.removeItem('apellidoUser');
                localStorage.removeItem('idUsuario');
                localStorage.removeItem('rolUser');
                
                // Detener monitoreos si existen
                if (typeof detenerMonitoreoInactividad === 'function') {
                    detenerMonitoreoInactividad();
                }
                if (typeof detenerValidacionToken === 'function') {
                    detenerValidacionToken();
                }
                
                // Mostrar alerta
                Swal.fire({
                    title: 'Sesión No Válida',
                    text: 'Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.',
                    icon: 'error',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: 'Ir a Login'
                }).then(() => {
                    window.location.href = '../../frontend/main/login.html';
                });
            }
            
            return response;
        })
        .catch(error => {
            console.error('Error en fetch:', error);
            throw error;
        });
};