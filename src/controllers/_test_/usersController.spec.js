// const { postNewUser } = require('../../controllers/usersController'); // Asegúrate de importar correctamente la función

// describe('postNewUser', () => {
//   it('should respond with status 201 and a JWT token for valid input', async () => {
//     // Datos de prueba
//     const mockReq = {
//       body: {
//         email: 'test@example.com',
//         password: 'password123',
//       },
//     };
//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Llamar a la función con datos de prueba simulados
//     await postNewUser(mockReq, mockRes);

//     // Verificar que la función respondió correctamente
//     expect(mockRes.status).toHaveBeenCalledWith(201);
//     expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
//   });

//   it('should respond with status 400 for incomplete fields', async () => {
//     // Datos de prueba con campos incompletos
//     const mockReq = {
//       body: {
//         email: 'test@example.com',
//         // Sin contraseña
//       },
//     };
//     const mockRes = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     // Llamar a la función con datos de prueba simulados
//     await postNewUser(mockReq, mockRes);

//     // Verificar que la función respondió correctamente
//     expect(mockRes.status).toHaveBeenCalledWith(400);
//     expect(mockRes.json).toHaveBeenCalledWith({ error: 'Completar campos' });
//   });

//   // Agregar más pruebas para otros casos de prueba (por ejemplo, contraseña demasiado corta, formato de correo electrónico no válido, etc.)
// });
// const { postNewUser } = require('../../controllers/usersController');
// const { createClient } = require('@supabase/supabase-js');
// const config = require('../../../config')
// const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// // Mock de Supabase
// describe('postNewUser', () => {
//     let mockSupabase;
  
//     beforeEach(() => {
//       // Mock de Supabase
//       mockSupabase = {
//         from: jest.fn().mockReturnThis(),
//         insert: jest.fn().mockReturnValue(Promise.resolve({ data: null, error: null })),
//       };
      
//       // Sobrescribir la implementación de supabase en user.service.js con el mock
//       jest.mock('../../../config', () => ({
//         supabase: mockSupabase,
//       }));
//     });
  
//   it('should insert a new user into Supabase', async () => {
//     // Simula una solicitud HTTP enviando un objeto de solicitud vacío (no se usa en la función)
//     const req = {};
    
//     // Simula una función de respuesta HTTP con un método status que devuelve un objeto vacío
//     const resp = { status: jest.fn().mockReturnValue({ json: jest.fn().mockReturnValue({}) }) };
    
//     const email = 'test@example.com';
//     const password = 'password123';
    
//     // Llama a la función del controlador con una solicitud y una respuesta simuladas
//     await postNewUser(req, resp);
    
//     // Verifica que se llamó correctamente a las funciones de Supabase
//     expect(mockSupabase.from).toHaveBeenCalledWith('users');
//     expect(mockSupabase.insert).toHaveBeenCalledWith([{ email, password }]);
//     // Aquí puedes agregar más expectativas según el comportamiento esperado de tu función de controlador
//   });
// });
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const config = require('../../../config');
const express = require('express');
const app = express(); // Crea una instancia de la aplicación Express

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Mockear la librería de Supabase

describe('POST /api/v1/users', () => {
    jest.mock('../../../config', () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              data: null, // Simula que no existe un usuario con el email dado
              error: null,
            }),
          }),
          insert: () => ({
            data: [{ id: 1 }], // Simula la inserción exitosa de un nuevo usuario
            error: null,
          }),
        }),
      }));

    it('should create a new user and return a JWT token if valid data is provided', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
  
      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);
        console.log(userData);
  
      expect(response.body).toHaveProperty('token');
  
      // Verificar que se haya utilizado bcrypt para hashear la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      expect(bcrypt.compareSync(userData.password, hashedPassword)).toBe(true);
  
      // Verificar que se haya utilizado jwt para firmar el token
      const decodedToken = jwt.decode(response.body.token);
      expect(decodedToken.userId).toEqual(1); // Mockeamos la inserción con ID 1
    });
  it('should return a 400 error if email or password is missing', async () => {
      const userData = {
        password: 'password123',
      };
  
      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  
    it('should return a 400 error if password length is less than 4 characters', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'abc', // Invalid password (less than 4 characters)
      };
  
      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  
    it('should return a 400 error if email format is invalid', async () => {
      const userData = {
        email: 'invalidemail', // Invalid email format
        password: 'password123',
      };
  
      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  
    // Agrega más casos de prueba para otros escenarios, por ejemplo:
    // - Prueba para usuario existente
    // - Prueba para errores durante la inserción del usuario en la base de datos
  });