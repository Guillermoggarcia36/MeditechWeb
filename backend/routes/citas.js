const express = require('express');
const routes = express.Router();

//Ruta para conseguir datos de usuario de BD
routes.get('/sedes', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FROM sedes', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
    });
});

// Registro de citas
routes.post('/', (req, res) => {
  const { id_sedeFK, id_medicoFK, id_pacienteFK, fecha, hora } = req.body;

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);

    const citaData = { id_sedeFK, id_medicoFK, id_pacienteFK, fecha, hora };

    conn.query("INSERT INTO citas SET ?", citaData, (err, result) => {
      if (err) return res.status(500).json(err);

      // Variables para definir codigo de cita segun su id
      const idCita = result.insertId;
      const codigoCita = `CI-${String(idCita).padStart(6, "0")}`;

      conn.query(
        "UPDATE citas SET codigo_cita = ? WHERE id_cita = ?",
        [codigoCita, idCita],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "Cita registrada correctamente",
            id_cita: idCita,
            codigo_cita: codigoCita,
          });
        }
      );
    });
  });
});

// Ruta para actualizar estado de citas a No asistida
routes.put('/sin-asistencia', (req, res) => {
  const { id_cita } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.query("UPDATE citas SET estado_cita = 'No asistida' WHERE id_cita = ?", [id_cita], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
      }
      res.json({ message: "Cita marcada como no asistida correctamente" });
    });
  });
});

// Ruta para cancelar cita
routes.put("/cancelar", (req, res) => {
  const { id_cita } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.query(
      "UPDATE citas SET estado_cita = 'Cancelada' WHERE id_cita = ?",
      [id_cita],
      (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Cita no encontrada" });
        }
        res.json({ message: "Cita cancelada correctamente" });
      },
    );
  });
});

// Ruta para confirmar cita
routes.put("/confirmar", (req, res) => {
  const { id_cita } = req.body;
  req.getConnection((err, conn) => {
    if (err) return res.status(500).json(err);
    conn.query(
      "UPDATE citas SET estado_cita = 'Confirmada' WHERE id_cita = ?",
      [id_cita],
      (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Cita no encontrada" });
        }
        res.json({ message: "Cita cancelada correctamente" });
      },
    );
  });
});

// Ruta INNER JOIN para segun consultar datos de cita en conjunto con nombre y apellido de paciente segun su id
routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT citas.id_cita, citas.codigo_cita, citas.fecha, citas.hora, citas.estado_cita, sedes.id_sede, sedes.nombre_sede, sedes.direccion, usuarios_paciente.nombres AS paciente_nombre, usuarios_paciente.apellidos AS paciente_apellido, usuarios_medicos.nombres AS medico_nombre, usuarios_medicos.apellidos AS medico_apellidos FROM citas INNER JOIN usuarios AS usuarios_paciente ON citas.id_pacienteFK = usuarios_paciente.id_usuario INNER JOIN usuarios AS usuarios_medicos ON citas.id_medicoFK = usuarios_medicos.id_usuario INNER JOIN sedes ON citas.id_sedeFK = sedes.id_sede ORDER BY codigo_cita ASC', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        });
    });
});

module.exports = routes;