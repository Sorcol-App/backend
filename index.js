const express = require('express');
const app = express();
const config = require('./config');
const userRoutes = require('./src/routes/users');
const { connect } = require('./connect');

const { port } = config;

// Middleware para parsear el body de las solicitudes
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Llama a la función connect al iniciar el servidor
connect().then(() => {
  // Inicia el servidor una vez que se haya establecido la conexión
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
  });
}).catch((error) => {
  console.error('Error al conectar con la base de datos:', error);
});

// Iniciar el servidor

// app.listen(port, () => {
//   console.log(`Servidor iniciado en el puerto ${port}`);
// });

// const express = require('express');
// const config = require('./config');
// const errorHandler = require('./src/middleware/error');
// const routes = require('./routes');
// const pkg = require('./package.json');

// const { port, secret } = config;
// const app = express();

// app.set('config', config);
// app.set('pkg', pkg);

// // parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// // app.use(authMiddleware(secret));

// // Registrar rutas
// routes(app, (err) => {
//   if (err) {
//     throw err;
//   }

//   app.use(errorHandler);

//   app.listen(port, () => {
//     console.info(`App listening on port ${port}`);
//   });
// });