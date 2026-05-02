const express = require('express');
const routes = express.Router();

routes.get('/medicamentos', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FROM medicamentos', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
    });
});

routes.get("/insumos", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("SELECT * FROM insumos", (err, rows) => {
      if (err) return res.send(err);
      res.json(rows);
    });
  });
});

routes.post("/medicamentos", (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("INSERT INTO medicamentos SET ?", [data], (err, rows) => {
      if (err) return res.send(err);
      res.json(rows);
    });
  });
});

routes.put("/insumos", (req, res) => {
  const { id_insumo, ...resto } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE insumos SET ? WHERE id_insumo = ?",
      [resto, id_insumo],
      (err, rows) => {
        if (err) return res.send(err);
        if (rows.affectedRows > 0) {
          res.json({ message: "Insumo actualizado correctamente" });
        } else {
          res.status(404).json({ message: "Insumo no encontrado" });
        }
      }
    );
  });
});

routes.put("/medicamentos", (req, res) => {
  const { id_medicamento, ...resto } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE medicamentos SET ? WHERE id_medicamento = ?",
      [resto, id_medicamento],
      (err, rows) => {
        if (err) return res.send(err);
        if (rows.affectedRows > 0) {
          res.json({ message: "Medicamento actualizado correctamente" });
        } else {
          res.status(404).json({ message: "Medicamento no encontrado" });
        }
      }
    );
  });
});

routes.post("/insumos", (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("INSERT INTO insumos SET ?", [data], (err, rows) => {
      if (err) return res.send(err);
      res.json(rows);
    });
  });
}); 

module.exports = routes;