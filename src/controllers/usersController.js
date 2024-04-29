const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const { supabaseUrl, supabaseKey, secret } = require('../../config');
const jwt = require('jsonwebtoken');

// Crear una instancia de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  getAllUsers: async (req, resp) => {
    try {
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) {
        throw new Error('Error al obtener usuarios desde la BD.');
      }
      resp.status(200).json(users);
    } catch (error) {
      resp.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  getUserId: async (req, resp) => {
    try {
      const userId = req.params.userId;

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!user) {
        resp.status(404).json({ error: 'Usuario no encontrado' });
      }
      return resp.json(user);
    } catch (error) {
      resp.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  postNewUser: async (req, resp) => {
    try {
      const { email, password } = req.body;
      

      // Validación de campos
      if (!email || !password) {
        return resp.status(400).json({ error: 'Completar campos' });
      }
      if (password.length < 4) {
        return resp
          .status(400)
          .json({ error: 'La contraseña debe tener un mín de 4 caracteres' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return resp
          .status(400)
          .json({ error: 'Formato de correo electrónico no válido' });
      }

      // Verificar si el usuario ya existe en Supabase
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);
       

      if (existingUser && existingUser.length > 0) {
        console.log('existingUser:', existingUser);

        return resp.status(403).json({ error: 'El usuario ya existe' });
      }

      // Crear un nuevo usuario en Supabase
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword }])
       //  .select('*');
        

        // const { data: userCreate } = await supabase
        // .from('users')
        // .select('*')
        // .eq('email', email);
        // console.log("antes de finalizar newUser:", userCreate);
      

      if (createUserError || error) {
        console.error('Error al crear el usuario:', createUserError.message);
        return resp.status(403).json({ error: 'Error al crear el usuario' });
      }

      // Generar un token JWT
      // const token = jwt.sign({ email }, secret, {
      //   expiresIn: '1h',
      // });
      

      resp.status(201).json( { newUser } );

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      resp.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

// // Registrar un nuevo usuario
// exports.registerUser = async (req, resp) => {
//   try {
//

//

//     // Verficar si user ya existe
//     const { data: existingUser, error } = await supabase
//       .from('users')
//       .select('id')
//       .eq('email', email)
//       .single();
//     if (existingUser) {
//       return resp.status(403) - json({ error: 'Usuario existente' });
//     }

//     // Crear nuevo usar
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Insertar usuario en Supabase
//     const { data: newUser, error: insertError } = await supabase
//       .from('users')
//       .insert([{ email, password: hashedPassword }]);

//     if (insertError) {
//       throw insertError;
//     }

//     // Remover el campo de contraseña antes de enviar la respuesta
//     delete newUser[0].password;
//     resp.status(200).json(newUser[0]);
//   } catch (error) {
//     console.error('Error al agregar usuario', error);
//     resp.status(500).json({ error: 'Error al agregar usuario' });
//   }
// }

// // Iniciar sesión
// exports.loginUser = async (req, res) => {
//   // Verificar si el usuario existe
//   // Verificar la contraseña
//   // Generar un token de autenticación
// };
