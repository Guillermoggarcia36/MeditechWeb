const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');

//Importar funciones del controlador
const { login, cambiarClave, restablecerClave } = require('../controllers/authController');

//Importar middlewares
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

//Ruta para conseguir datos de usuario de BD
routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FROM usuarios ORDER BY id_usuario', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
    });
});

//Ruta para crear usuarios
routes.post('/', async (req, res) => {
    req.getConnection(async (err, conn) => {
        if (err) return res.send(err);

        const datos = { ...req.body };
        if (datos.clave) {
            datos.clave = await bcrypt.hash(datos.clave, 8);
        }

        conn.query('INSERT INTO usuarios SET ?', [datos], (err, rows) => {
            if (err) return res.send(err);
            res.json({ message: "Usuario creado correctamente", usuario: datos });
        });
    });
});

//Ruta para actualizar datos de usuario en BD
routes.put('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    const { id_usuario, ...resto } = req.body;

    conn.query(
      'UPDATE usuarios SET ? WHERE id_usuario = ?',
      [resto, id_usuario],
      (err, rows) => {
        if (err) return res.send(err);

        if (rows.affectedRows > 0) {
          res.json({ message: "Usuario actualizado correctamente" });
        } else {
          res.status(404).json({ message: "Usuario no encontrado" });
        }
      }
    );
  });
});

//Ruta para logeo
routes.post('/login', login);
routes.put('/cambiar-clave', verificarToken, cambiarClave); //ruta para cambio de contraseña
routes.put('/restablecer-clave', restablecerClave);

//Ruta de dashboard (protegido por token)
routes.get('/dashboard', verificarToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario; // viene del token
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ message: 'Error de conexión', err });
        const sql = `
            SELECT id_usuario, nombres, apellidos, id_rolFK, estado_usuario, correo_electronico
            FROM usuarios 
            WHERE id_usuario = ?
        `;
        conn.query(sql, [id_usuario], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error al consultar la BD', err });
            if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado o inexistente' });
            res.json({
                message: 'Bienvenido al dashboard',
                usuario: results[0]
            });
        });
    });
});

//Verificar validez del token
routes.get('/verify-token', verificarToken, (req, res) => {
    // Si el token pasa el middleware, es válido
    res.json({ 
        valid: true, 
        message: "Token válido",
        usuario: req.usuario
    });
});

//Validar token desde el frontend
routes.post('/validar-token', verificarToken, (req, res) => {
    res.json({ 
        valid: true, 
        message: "Token válido",
        usuario: req.usuario
    });
});

routes.get('/paging', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        const query = 'SELECT * FROM usuarios ORDER BY id_usuario LIMIT ?, ?';
        conn.query(query, [offset, limit], (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    });
});

routes.post('/orden-descendente', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        const columna = req.body.columna;

        const query = `SELECT * FROM usuarios ORDER BY ${columna} DESC LIMIT 10`
        conn.query(query, (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    });
});

routes.post('/orden-ascendente', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        const columna = req.body.columna;

        const query = `SELECT * FROM usuarios ORDER BY ${columna} ASC LIMIT 10`
        conn.query(query, (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    });
});

routes.get("/medicos", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("SELECT * FROM usuarios WHERE id_rolFK = 2", (err, rows) => {
      if (err) return res.send(err);
      res.json(rows);
    });
  });
});

module.exports = routes;