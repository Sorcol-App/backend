const express = require('express');
const app = express();
const config = require('./config');
const userRoutes = require('./src/routes/users');
const { supabase } = require('./connect'); // Importa la instancia de Supabase

const { port } = config;

// Middleware para parsear el body de las solicitudes
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
