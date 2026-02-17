// ✅ Gestor de sesión con inactividad y validación de token
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutos en milisegundos
const WARNING_TIMEOUT = 4 * 60 * 1000; // 4 minutos (1 min antes de expirar)
const VALIDATION_INTERVAL = 2 * 60 * 1000; // Validar token cada 2 minutos
const VALIDATE_TOKEN_URL = "http://localhost:9000/users/validar-token";

let inactivityTimer;
let warningTimer;
let validationTimer;

// Eventos que indican actividad del usuario
const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

// ✅ Función para CERRAR SESIÓN (sin autorización)
function cerrarSesion(razon = 'inactividad') {
  console.error(`⛔ Cerrando sesión por: ${razon}`);
  
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('nameUser');
  localStorage.removeItem('apellidoUser');
  localStorage.removeItem('idUsuario');
  localStorage.removeItem('rolUser');
  
  // Detener monitoreos
  detenerMonitoreoInactividad();
  detenerValidacionToken();
  
  // Mostrar alerta de sesión cerrada
  Swal.fire({
    title: 'Sesión Cerrada',
    text: `Tu sesión ha sido cerrada por ${razon}. Por favor, inicia sesión nuevamente.`,
    icon: 'warning',
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Ir a Login'
  }).then(() => {
    window.location.href = '../main/login.html';
  });
}

// ✅ Función para mostrar advertencia con SweetAlert
function mostrarAdvertencia() {
  console.warn("⏱️ Te quedan 1 minuto de inactividad. La sesión se cerrará automáticamente.");
  
  Swal.fire({
    title: '⚠️ Advertencia de Inactividad',
    text: 'Tu sesión expirará en 1 minuto por inactividad. Haz algo para continuar.',
    icon: 'warning',
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#3b82f6'
  }).then(() => {
    // Reiniciar el timer cuando el usuario cierre la alerta (indica actividad)
    reiniciarInactivityTimer();
  });
}

// ✅ Función para reiniciar timers de inactividad
function reiniciarInactivityTimer() {
  // Limpiar timers anteriores
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
  
  console.log("✅ Actividad detectada. Timer reiniciado.");
  
  // Mostrar advertencia después de 4 minutos
  warningTimer = setTimeout(mostrarAdvertencia, WARNING_TIMEOUT);
  
  // Cerrar sesión después de 5 minutos
  inactivityTimer = setTimeout(() => cerrarSesion('inactividad'), SESSION_TIMEOUT);
}

// ✅ Validar token periódicamente
async function validarTokenPeriodicamente() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    cerrarSesion('token no encontrado');
    return;
  }

  try {
    const response = await fetch(VALIDATE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      const data = await response.json();
      console.error('Token inválido:', data.reason);
      cerrarSesion(`token expirado o inválido (${data.reason})`);
      return;
    }

    if (!response.ok) {
      console.error('Error al validar token:', response.statusText);
      return;
    }

    console.log('✅ Token válido');
  } catch (error) {
    console.error('Error en validación de token:', error);
    // No cerrar sesión por error de conexión (podría ser temporal)
  }
}

// ✅ Agregar listeners para detectar actividad
function iniciarMonitoreoInactividad() {
  console.log("✅ Monitoreo de inactividad iniciado (5 minutos)");
  
  // Iniciar timer al cargar la página
  reiniciarInactivityTimer();
  
  // Reiniciar timer cada vez que detecte actividad
  activityEvents.forEach(event => {
    document.addEventListener(event, reiniciarInactivityTimer, true);
  });
}

// ✅ Iniciar validación periódica del token
function iniciarValidacionToken() {
  console.log("✅ Validación periódica de token iniciada (cada 2 minutos)");
  
  // Validar inmediatamente al cargar
  validarTokenPeriodicamente();
  
  // Validar cada 2 minutos
  validationTimer = setInterval(validarTokenPeriodicamente, VALIDATION_INTERVAL);
}

// ✅ Limpiar listeners de inactividad
function detenerMonitoreoInactividad() {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
  
  activityEvents.forEach(event => {
    document.removeEventListener(event, reiniciarInactivityTimer, true);
  });
  
  console.log("🛑 Monitoreo de inactividad detenido");
}

// ✅ Limpiar intervalo de validación
function detenerValidacionToken() {
  clearInterval(validationTimer);
  console.log("🛑 Validación de token detenida");
}

// ✅ Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  // Solo iniciar si hay token (usuario autenticado)
  if (token) {
    iniciarMonitoreoInactividad();
    iniciarValidacionToken();
  } else {
    // Si no hay token, redirigir a login
    window.location.href = '../main/login.html';
  }
});

// ✅ Detener monitoreo si se cierra la página
window.addEventListener('beforeunload', () => {
  detenerMonitoreoInactividad();
  detenerValidacionToken();
});