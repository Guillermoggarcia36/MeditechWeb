// ============================================
// ✅ PROTECTOR DE RUTAS DEL DASHBOARD
// ============================================
// Este script verifica que el usuario tenga un token válido
// Se debe cargar ANTES de cualquier otro script en las páginas del dashboard

(function protectDashboardRoutes() {
    const token = localStorage.getItem('token');
    
    // Si no hay token, redirigir a login inmediatamente
    if (!token) {
        console.warn('⛔ Token no encontrado. Redirigiendo a login...');
        window.location.href = '../main/login.html';
        return;
    }
    
    // Validar que el token tiene el formato correcto (no está vacío)
    if (token.trim() === '') {
        console.warn('⛔ Token vacío. Redirigiendo a login...');
        localStorage.removeItem('token');
        window.location.href = '../main/login.html';
        return;
    }
    
    console.log('✅ Token encontrado. Acceso al dashboard permitido.');
})();
