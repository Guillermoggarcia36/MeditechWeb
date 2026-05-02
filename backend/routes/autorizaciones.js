const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query(
          "SELECT autorizaciones.id_autorizacion,autorizaciones.codigo_autorizacion, autorizaciones.id_historialFK, autorizaciones.estado_autorizacion, autorizaciones.fecha_autorizacion, autorizaciones.nota, historial_clinico.id_pacienteFK, usuarios_paciente.nombres AS paciente_nombre, usuarios_paciente.apellidos AS paciente_apellido FROM autorizaciones INNER JOIN historial_clinico ON autorizaciones.id_historialFK = historial_clinico.id_historial INNER JOIN usuarios AS usuarios_paciente ON historial_clinico.id_pacienteFK = usuarios_paciente.id_usuario;",
          (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
          },
        );
    });
});

routes.get('/medicamentos', (req, res) => {
    req.getConnection((err, conn) => {
        const id_autorizacionFK = req.query.id_autorizacionFK;
        if (err) return res.send(err);
        conn.query(
          "SELECT autorizacion_medicamentos.id_autorizacionFK, autorizacion_medicamentos.cantidad, autorizacion_medicamentos.notas, medicamentos.id_medicamento, medicamentos.nombre_medicamento, medicamentos.stock_disponible, autorizaciones.id_historialFK, autorizaciones.codigo_autorizacion, autorizaciones.estado_autorizacion, autorizaciones.fecha_autorizacion, autorizaciones.nota FROM autorizacion_medicamentos INNER JOIN medicamentos ON autorizacion_medicamentos.id_medicamentoFK = medicamentos.id_medicamento INNER JOIN autorizaciones ON autorizacion_medicamentos.id_autorizacionFK = autorizaciones.id_autorizacion WHERE id_autorizacionFK = ?;",
          [id_autorizacionFK],
          (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
          },
        );
    });
});

routes.post('/', (req, res) => {
    const newAutorizacion = {
        id_historialFK: req.body.id_historialFK,
        estado_autorizacion: req.body.estado_autorizacion,
        fecha_autorizacion: req.body.fecha_autorizacion,
        nota: req.body.nota,
    };

    const medicamentos = req.body.medicamentos || [];

    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO autorizaciones SET ?', newAutorizacion, (err, result) => {
            if (err) return res.send(err);
            const id_autorizacion = result.insertId;
            const codigo_autorizacion = `AUT-${String(id_autorizacion).padStart(6, "0")}`;

            conn.query('UPDATE autorizaciones SET codigo_autorizacion = ? WHERE id_autorizacion = ?', [codigo_autorizacion, id_autorizacion], (err) => {
                if (err) return res.send(err);
            });

            if (medicamentos.length > 0) {
                const values = medicamentos.map(medicamento => [id_autorizacion, medicamento.id_medicamentoFK, medicamento.cantidad, medicamento.notas]);
                conn.query('INSERT INTO autorizacion_medicamentos (id_autorizacionFK, id_medicamentoFK, cantidad, notas) VALUES ?', [values], (err) => {
                    if (err) return res.send(err);
                    res.json({ id_autorizacion, codigo_autorizacion, ...newAutorizacion });
                });
            } else {
                res.json({ id_autorizacion, codigo_autorizacion, ...newAutorizacion });
            }
        });
    });
});

routes.put('/', (req, res) => {
    const { id_autorizacion, estado_autorizacion } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('UPDATE autorizaciones SET estado_autorizacion = ? WHERE id_autorizacion = ?', [estado_autorizacion, id_autorizacion], (err, result) => {
            if (err) return res.send(err);
            if (result.affectedRows > 0) {
                res.json({ message: "Autorización actualizada correctamente" });
            } else {
                res.status(404).json({ message: "Autorización no encontrada" });
            }
        });
    });
});

module.exports = routes;