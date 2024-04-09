const { createClient } = require('@supabase/supabase-js');
const express = require('express');

// Reemplaza estas variables con tu información de Supabase
const SUPABASE_URL = 'https://kzdrxokqqqetftgwpsly.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZHJ4b2txcXFldGZ0Z3dwc2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNTk3NjIsImV4cCI6MjAyNzgzNTc2Mn0.cM9DwBz4CaY__b07eKBVGc4Ptxs_XENrnOjqy3Vs8s8';

// Crea un cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Crea una aplicación Express
const app = express();

// Middleware para parsear el body
app.use(express.json());

// Define la ruta para obtener los productos
app.get('/productos', async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*');
  if (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
    return;
  }

  res.json({ data });
  console.log(data);
});

app.post('/productos', async (req, res) => {
  const  name  = req.body;
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
});

// Inicia el servidor Express
app.listen(3000, () => {
  console.log('Servidor Express escuchando en el puerto 3000');
});