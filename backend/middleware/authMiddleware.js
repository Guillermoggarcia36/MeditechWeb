// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido. Verifica tu archivo .env");
};

// ✅ Almacenar últimas actividades de usuarios (id_usuario -> timestamp)
const userActivity = new Map();
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos en milisegundos

// Login
const login = (req, res) => {
    const { id_usuario, clave } = req.body;

    if (!id_usuario || !clave) {
        return res.status(400).json({ message: "ID y contraseña requeridos" });
    }

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ message: "Error de conexión" });

        conn.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id_usuario], async (err, results) => {
            if (err) return res.status(500).json({ message: "Error en consulta" });
            if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado o inexistente" });

            const user = results[0];

            // Verifica contraseña con bcrypt
            const passwordMatch = await bcrypt.compare(clave, user.clave);
            if (!passwordMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

            // Genera token JWT
            const token = jwt.sign({ id_usuario: user.id_usuario, id_rolFK: user.id_rolFK }, JWT_SECRET, { expiresIn: "4h" });

            // ✅ Registrar actividad inicial del usuario
            userActivity.set(user.id_usuario, Date.now());

            res.json({
                message: "Login exitoso",
                token,
                cambio_clave: Boolean(user.cambio_clave), // Cambia columna cambio_clave = 1 en BD
                usuario: {
                    id_usuario: user.id_usuario,
                    nombres: user.nombres,
                    apellidos: user.apellidos,
                    id_rolFK: user.id_rolFK
                }
            });
        });
    });
};

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    // ❌ CASO 1: No hay header de autorización
    if (!authHeader) {
        return res.status(401).json({ 
            message: 'No se proporcionó token',
            reason: 'no_token',
            logout: true 
        });
    }

    // ❌ CASO 2: Header malformado (no es Bearer token)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            message: 'Formato de token inválido',
            reason: 'invalid_format',
            logout: true 
        });
    }

    const token = parts[1];
    
    // ❌ CASO 3: Token vacío
    if (!token) {
        return res.status(401).json({ 
            message: 'Token vacío',
            reason: 'empty_token',
            logout: true 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // ✅ VERIFICAR INACTIVIDAD
        const lastActivity = userActivity.get(decoded.id_usuario);
        const ahora = Date.now();
        
        if (lastActivity && (ahora - lastActivity) > INACTIVITY_TIMEOUT) {
            userActivity.delete(decoded.id_usuario);
            return res.status(401).json({ 
                message: 'Sesión expirada por inactividad',
                reason: 'inactivity_timeout',
                logout: true 
            });
        }
        
        // ✅ Actualizar última actividad
        userActivity.set(decoded.id_usuario, ahora);
        
        req.usuario = decoded; 
        next();
    } catch (err) {
        // ❌ CASO 4: Token expirado o inválido
        console.error('Error token:', err.message);
        
        let reason = 'invalid_token';
        if (err.name === 'TokenExpiredError') {
            reason = 'token_expired';
        } else if (err.name === 'JsonWebTokenError') {
            reason = 'token_malformed';
        }
        
        res.status(401).json({ 
            message: 'Token inválido o expirado',
            reason: reason,
            logout: true 
        });
    }
}

// Middleware para verificar rol
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.id_rolFK)) {
            return res.status(403).json({ message: 'No tienes permiso para esta acción' });
        }
        next();
    }
}

module.exports = { login, verificarToken, verificarRol };