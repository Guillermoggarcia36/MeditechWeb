const express = require('express');
const routes = express.Router();

routes.get('/autorizaciones', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FORM autorizaciones', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
    });
});

module.exports = routes;