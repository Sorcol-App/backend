require('dotenv').config(); // Cargar variables de entorno desde un archivo .env

const config = {
  port: process.env.PORT || 3000, // Puerto del servidor, utiliza 3000 si no está definido en las variables de entorno
  supabaseUrl: process.env.DATABASE_URL, // URL de conexión a la base de datos de Supabase
  supabaseKey: process.env.SUPABASE_KEY // Clave de API de Supabase
};

module.exports = config;
