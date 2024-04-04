// Conexion base de datos

const { createClient } = require ("@supabase/supabase-js");

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {supabase};
