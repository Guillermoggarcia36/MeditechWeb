// Variables
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const userRoutes = require('./routes/users');
const citasRoutes = require('./routes/citas')
const historialRoutes = require('./routes/historial');
const inventarioRoutes = require('./routes/inventario');
const consultaRoutes = require('./routes/consultas');
const autorizacionesRoutes = require('./routes/autorizaciones');
const cors = require('cors');

const app = express();

app.set('port', process.env.PORT || 9000);

const dbOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'meditechbd'
};

// Middleware CORS (solo para desarrollo)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware para desactivar cache
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Middleware conexión MySQL y parseo JSON
app.use(myconn(mysql, dbOptions, 'single'));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.send('Servidor Meditech activo');
});

app.use('/users', userRoutes);
app.use('/citas', citasRoutes);
app.use('/historial', historialRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/consultas', consultaRoutes);
app.use('/autorizaciones', autorizacionesRoutes);

// Servidor corriendo
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto:', app.get('port'));
});

// Mensaje de prueba a conexión a base de datos
mysql.createConnection(dbOptions).connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});