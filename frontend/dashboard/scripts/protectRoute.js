// PROTECTOR DE RUTAS DEL DASHBOARD

(function protectDashboardRoutes() {
    const token = localStorage.getItem('token');

    if (!token || token.trim() === '') {
        localStorage.removeItem('token');
        window.location.href = '../main/login.html';
        return;
    }

    // Permisos por página: página → roles permitidos
    const paginasPermitidas = {
        'dashboard-main.html':          [1, 2, 3, 4],
        'dashboard-usuarios.html':      [1],
        'dashboard-citas.html':         [1, 3],
        'dashboard-historial.html':     [1, 2],
        'dashboard-inventario.html':    [1, 4],
        'dashboard-autorizaciones.html':[1]
    };

    // Botones del sidebar → roles que pueden verlos
    const botonesPermitidos = {
        'usuarios-btn':      [1],
        'citas-btn':         [1, 3],
        'historial-btn':     [1, 2],
        'inventario-btn':    [1, 4],
        'autorizaciones-btn':[1]
    };

    const rol = parseInt(localStorage.getItem('rolUser'));
    const paginaActual = window.location.pathname.split('/').pop();
    const rolesPermitidos = paginasPermitidas[paginaActual] || [1];

    // Si el rol no tiene acceso a esta página, mostrar mensaje de permisos
    if (!rolesPermitidos.includes(rol)) {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.margin = '0';
            document.body.style.background = 'linear-gradient(135deg, #498EC9 0%, #2d5a8c 100%)';
            document.body.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:'Roboto',sans-serif;text-align:center;gap:20px;">
                    <img src="../assets/logos/logoMeditech.svg" style="width:180px;opacity:0.95;" onerror="this.style.display='none'">
                    <div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:12px;padding:40px 48px;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:2px 20px 40px rgba(0,0,0,0.2);">
                        <img src="../assets/icons/candado.png" style="width:56px;opacity:0.85;" onerror="this.style.display='none'">
                        <h2 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Acceso denegado</h2>
                        <p style="color:rgba(255,255,255,0.85);margin:0;font-size:1rem;font-weight:300;">No tienes los suficientes permisos para el ingreso de este módulo.</p>
                        <a href="dashboard-main.html" style="margin-top:8px;padding:10px 28px;background:#fff;color:#2d5a8c;border-radius:6px;text-decoration:none;font-weight:700;font-size:0.95rem;box-shadow:0 4px 12px rgba(0,0,0,0.15);">Volver al inicio</a>
                    </div>
                </div>`;
        });
        return;
    }
    if (rolesPermitidos.includes(rol)) {
        // Mostrar solo los botones permitidos para el rol
        Object.keys(botonesPermitidos).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                if (botonesPermitidos[id].includes(rol)) {
                    btn.style.display = 'grid';
                } else {
                    btn.style.display = 'none';
                }
            }
        });
    }
}
)();
