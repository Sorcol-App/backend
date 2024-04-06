const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const { supabaseUrl, supabaseKey } = require('../../config');
const jwt = require('jsonwebtoken');

// Crear una instancia de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Registrar un nuevo usuario
async function registerUser(req, resp) {
  try {
    const { email, password } = req.body;

    // Validar email y password
    if (!email) {
      return resp.status(400).json({ error: 'Ingresar correo por favor' });
    }
    if (!password) {
      return resp.status(400).json({ error: 'Ingresa tu contraseña' });
    }
    if (password.length < 4) {
      return resp.status(400).json({ error: 'Contraseña débil' });
    }

    // Verficar si user ya existe
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (existingUser) {
      return resp.status(403) - json({ error: 'Usuario existente' });
    }

    // Crear nuevo usar
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insertar usuario en Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, role }]);

    if (insertError) {
      throw insertError;
    }

    // Remover el campo de contraseña antes de enviar la respuesta
    delete newUser[0].password;
    resp.status(200).json(newUser[0]);
  } catch (error) {
    console.error('Error al agregar usuario', error);
    resp.status(500).json({ error: 'Error al agregar usuario' });
  }
}

exports.registerUser = async (req, res) => {
  // Verificar si el usuario ya existe
  // Encriptar la contraseña
  // Crear un nuevo usuario
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  // Verificar si el usuario existe
  // Verificar la contraseña
  // Generar un token de autenticación
};
