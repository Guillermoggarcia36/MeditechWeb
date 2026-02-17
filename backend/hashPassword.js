// hashPassword.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

//Datos de conexión de base datos
const dbOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'meditechbd'
};

//Variable para conexión con base de datos
const conn = mysql.createConnection(dbOptions);

//Conexion hacía BD para hasheo de claves
conn.connect(err => {
  if (err) throw err;
  console.log('Conectado a la BD');

  conn.query('SELECT id_usuario, clave FROM usuarios', (err, results) => {
    if (err) throw err;

    results.forEach(user => {
      const hashed = bcrypt.hashSync(user.clave, 10); // Genera el hash real
      conn.query(
        'UPDATE usuarios SET clave = ?, primer_inicio = 1 WHERE id_usuario = ?',
        [hashed, user.id_usuario],
        (err) => {
          if (err) console.error(`Error al actualizar ${user.id_usuario}:`, err);
          else console.log(`Usuario ${user.id_usuario} actualizado con hash`);
        }
      );
    });
    
    console.log('Proceso finalizado');
    conn.end();
  });
});

//Funcion para hasheo de claves
function hashPassword(clave) {
    return bcrypt.hashSync(clave, 10);
}

//Exportación de modulo
module.exports = hashPassword;