// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido. Verifica tu archivo .env");
}

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

            // Verificar si el usuario está activo
            if (user.estado_usuario !== 'Activo') {  // o 1 si usas INT
                return res.status(403).json({ message: "El usuario se encuentra inactivo, contactarse con Administrativo" });
            };

            console.log("Clave ingresada:", clave);
            console.log("Hash en DB:", user.clave);


            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(clave, user.clave);
            if (!passwordMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

            // Migración transparente: si el hash tiene 10 rondas, re-hashear con 8
            const saltRoundsActual = parseInt(user.clave.split('$')[2]);
            if (saltRoundsActual > 8) {
                const nuevoHash = await bcrypt.hash(clave, 8);
                conn.query("UPDATE usuarios SET clave = ? WHERE id_usuario = ?", [nuevoHash, user.id_usuario]);
            }

            // Crear token JWT
            const token = jwt.sign({ id_usuario: user.id_usuario, id_rolFK: user.id_rolFK }, JWT_SECRET, { expiresIn: "4h" });

            res.json({
                message: "Login exitoso",
                token,
                cambio_clave: Boolean(user.cambio_clave),
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



// Cambiar contraseña
const cambiarClave = (req, res) => {
    const { id_usuario, nuevaClave } = req.body;

    if (!id_usuario || !nuevaClave) {
        return res.status(400).json({ message: "ID y nueva contraseña requeridos" });
    }

    const hashedPassword = bcrypt.hashSync(nuevaClave, 8);

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ message: "Error de conexión" });

        const sql = "UPDATE usuarios SET clave = ?, cambio_clave = 0 WHERE id_usuario = ?";
        conn.query(sql, [hashedPassword, id_usuario], (err, result) => {
            if (err) return res.status(500).json({ message: "Error al actualizar la contraseña" });

            if (result.affectedRows > 0) {
                res.json({ message: "Contraseña actualizada correctamente" });
            } else {
                res.status(404).json({ message: "Usuario no encontrado o inexistente" });
            }
        });
    });
};

// Restablecer contraseña
const restablecerClave = (req, res) => {
    const { id_usuario } = req.body;
    const clave = id_usuario;

    const hashedPassword = bcrypt.hashSync(String(id_usuario), 8);

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ message: "Error de conexión" });

        const sql = "UPDATE usuarios SET clave = ?, cambio_clave = 1 WHERE id_usuario = ?";
        conn.query(sql, [hashedPassword, id_usuario], (err, result) => {
            if (err) return res.status(500).json({ message: "Error al actualizar la contraseña" });

            if (result.affectedRows > 0) {
                res.json({ message: "Contraseña restablecida correctamente" });
            } else {
                res.status(404).json({ message: "Usuario no encontrado o inexistente" });
            }
        });
    });
}

module.exports = { login, cambiarClave, restablecerClave };