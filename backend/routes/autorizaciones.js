const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FROM autorizaciones', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
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

            if (medicamentos.length > 0) {
                const values = medicamentos.map(medicamento => [id_autorizacion, medicamento.id_medicamentoFK, medicamento.cantidad, medicamento.notas]);
                conn.query('INSERT INTO autorizacion_medicamentos (id_autorizacionFK, id_medicamentoFK, cantidad, notas) VALUES ?', [values], (err) => {
                    if (err) return res.send(err);
                    res.json({ id_autorizacion, ...newAutorizacion });
                });
            } else {
                res.json({ id_autorizacion, ...newAutorizacion });
            }
        });
    });
});

module.exports = routes;