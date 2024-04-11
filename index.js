const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const config = require('./config');
const v1UserRouter = require('./src/v1/routes/usersRoutes');

// Crea un cliente de Supabase
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Crea una aplicación Express
const app = express();

// Middleware para parsear el body
app.use(express.json());

app.use('/api/v1/users', v1UserRouter);

/*app.post('/productos', async (req, res) => {
  const name = req.body;
  console.log(name, 'body');

  const { data, error } = await supabase.from('productos').insert({
    name,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json({ data });
  console.log(data);
});*/

// Inicia el servidor Express
app.listen(3000, () => {
  console.log(`Servidor Express escuchando en el puerto 3000`);
});
