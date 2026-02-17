const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * FROM historial_clinico', (err, rows) => {
            if (err) return res.send
            res.json(rows);
        });
    });
});

routes.get('/resumen', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT historial_clinico.codigo_historial, historial_clinico.id_pacienteFK, historial_clinico.fecha_nacimiento, historial_clinico.sexo, historial_clinico.grupo_sanguineo, usuarios_paciente.nombres AS paciente_nombre, usuarios_paciente.apellidos AS paciente_apellido FROM historial_clinico INNER JOIN usuarios AS usuarios_paciente ON historial_clinico.id_pacienteFK = usuarios_paciente.id_usuario', (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    });
});

routes.post('/', (req, res) => {
    const { id_pacienteFK, fecha_registro, peso_paciente, altura_paciente, grupo_sanguineo, antecedentes_personales, antecedentes_familiares, procedimientos_quirurgicos, descripcion_general, estado_clinico } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json(err);

        const historialData = { id_pacienteFK, fecha_registro, peso_paciente, altura_paciente, grupo_sanguineo, antecedentes_personales, antecedentes_familiares, procedimientos_quirurgicos, descripcion_general, estado_clinico };

        conn.query("INSERT INTO historial_clinico SET ?", historialData, (err, result) => {
            if (err) return res.status(500).json(err);

            const idHistorial = result.insertId;
            const codigoHistorial = `HM-${String(idHistorial).padStart(6, "0")}`;

            conn.query(
                "UPDATE historial_clinico SET codigo_historial = ? WHERE id_historial = ?",
                [codigoHistorial, idHistorial],
                (err) => {
                    if (err) return res.status(500).json(err);

                    res.json({ 
                        message: "Historial clínico registrado correctamente", 
                        id_historial: result.insertId, 
                        codigo_historial: codigoHistorial 
                });
            });
        });
    });
});


module.exports = routes;