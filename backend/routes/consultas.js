const express = require('express');
const routes = express.Router();
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

routes.use(verificarToken, verificarRol([1, 2]));

routes.get("/", verificarToken, verificarRol([1, 2]), (req, res) => {
  const { id_historialFK } = req.query;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "SELECT * FROM consultas WHERE id_historialFK = ?",
      [id_historialFK],
      (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      },
    );
  });
});

routes.post("/", verificarToken, verificarRol([1, 2]), (req, res) => {
  const { id_historialFK, fecha_consulta, motivo_consulta, descripcion_consulta, diagnostico, observaciones } = req.body;
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json(err);

        const consultaData = { id_historialFK, fecha_consulta, motivo_consulta, descripcion_consulta, diagnostico, observaciones };
        conn.query("INSERT INTO consultas SET ?", consultaData, (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Consulta registrada exitosamente", id_consulta: result.insertId });
        });
    });
});

module.exports = routes;