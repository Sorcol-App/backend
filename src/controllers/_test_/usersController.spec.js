const request = require ('supertest');
const app = require('../../../index'); // Importa tu aplicación Express
const { postNewUser } = require('../usersController');
const supabase = require('../../../connect'); // Importa tu configuración de Supabase aquí
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require ('../../../config')

describe('postNewUser', () => {
  const mockSupabase = {
    from: jest.fn(() => mockSupabase), // Simula el método 'from' que devuelve a sí mismo
    select: jest.fn().mockReturnThis(), // Simula el método 'select' que devuelve a sí mismo
    eq: jest.fn().mockReturnThis(), // Simula el método 'eq' que devuelve a sí mismo
    data: [], // Simula los datos devueltos por la consulta
  };


  // Simula la importación de Supabase y asigna el objeto simulado
  jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => mockSupabase), // Simula la creación del cliente Supabase
  }));

  
  jest.mock('bcrypt');
  jest.mock('jsonwebtoken');
  
  describe('postNewUser', () => {
    let req, resp;
  
    beforeEach(() => {
      req = {
        body: {},
      };
      resp = {
        status: jest.fn(() => resp),
        json: jest.fn(),
      };
      jest.clearAllMocks(); // Limpiar todos los mocks entre cada prueba
    });

  it('debería retornar un error si faltan campos', async () => {
    await postNewUser(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Completar campos' });
  });

  it('debería retornar un error si la contraseña es demasiado corta', async () => {
    req.body.email = 'test@example.com';
    req.body.password = 'abc';

    await postNewUser(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({
      error: 'La contraseña debe tener un mín de 4 caracteres',
    });
  });

  it('debería retornar un error si el formato del correo electrónico es inválido', async () => {
    req.body.email = 'invalidemail';
    req.body.password = 'password1234';

    await postNewUser(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({
      error: 'Formato de correo electrónico no válido',
    });
  });

  it('debería retornar un error si el usuario ya existe en Supabase', async () => {
    // Simula que existe un usuario con el mismo email en Supabase
    mockSupabase.from().select().eq().data = [{ email: 'existinguser@example.com' }];
  
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'existinguser@example.com', password: 'password1234' });
  
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'El usuario ya existe' });
  });

  it('debería generar un token JWT válido al registrar un nuevo usuario', async () => {
    // Datos del usuario nuevo
    const userData = {
      email: 'test@example.com',
      password: 'password1234',
    };
  
    // Simular inserción exitosa de usuario en Supabase
    const newUser = { ...userData };
    mockSupabase.from().insert.mockResolvedValue({ data: [newUser] });
  
    // Simular hash de contraseña con bcrypt
    const hashedPassword = 'hashed_password';
    bcrypt.hash.mockResolvedValue(hashedPassword);
  
    // Simular firma de token JWT con jsonwebtoken
    const token = 'fake_token';
    jwt.sign.mockReturnValue(token);
  
    // Realizar la solicitud para registrar un nuevo usuario
    const response = await request(app)
      .post('/api/v1/users')
      .send(userData);
  
    // Verificar que la respuesta tenga estado 201 (creado)
    expect(response.status).toBe(201);
  
    // Verificar que la respuesta incluya un token JWT
    expect(response.body).toHaveProperty('token', token);
  
    // Verificar que se haya llamado bcrypt.hash() con la contraseña
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, expect.any(Number));
  
    // Verificar que se haya llamado jwt.sign() con la información correcta
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: userData.email },
      secret,
      { expiresIn: '1h' }
    );
  
    // Verificar que el token generado sea válido y contenga la información esperada
    const decoded = jwt.verify(token, secret);
    expect(decoded).toHaveProperty('email', userData.email);
  });
  
  // it('debería generar un token JWT válido al registrar un nuevo usuario', async () => {
  //   req.body.email = 'test@example.com';
  //   req.body.password = 'password1234';
  
  //   // Simular inserción exitosa de usuario en Supabase
  //   const newUser = { email: req.body.email, password: req.body.password };
  //   mockSupabase.from().insert.mockResolvedValue({ data: [newUser] });
  
  //   // Simular hash de contraseña con bcrypt
  //   const hashedPassword = 'hashed_password';
  //   bcrypt.hash.mockResolvedValue(hashedPassword);
  
  //   // Simular firma de token JWT con jsonwebtoken
  //   const token = 'fake_token';
  //   jwt.sign.mockReturnValue(token);
  
  //   // Realizar la solicitud para registrar un nuevo usuario
  //   const response = await request(app)
  //     .post('/api/v1/users')
  //     .send({ email: req.body.email, password: req.body.password });
  
  //   // Verificar que la respuesta tenga estado 201 (creado)
  //   expect(response.status).toBe(201);
  
  //   // Verificar que la respuesta incluya un token JWT
  //   expect(response.body).toHaveProperty('token', token);
  
  //   // Verificar que se haya llamado bcrypt.hash() con la contraseña
  //   expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, expect.any(Number));
  
  //   // Verificar que se haya llamado jwt.sign() con la información correcta
  //   expect(jwt.sign).toHaveBeenCalledWith(
  //     { email: req.body.email },
  //     secret, // Reemplaza 'your_secret_key' con tu clave secreta JWT
  //     { expiresIn: '1h' }
  //   );
  
  //   // Verificar que el token generado sea válido y contenga la información esperada
  //   const decoded = jwt.verify(token, secret); // Decodificar el token
  //   expect(decoded).toHaveProperty('email', req.body.email);
  // });

});

// describe('postNewUser', () => {

//   const mockSupabase = {
//     from: jest.fn(() => mockSupabase), // Simula el método 'from' que devuelve a sí mismo
//     select: jest.fn().mockReturnThis(), // Simula el método 'select' que devuelve a sí mismo
//     eq: jest.fn().mockReturnThis(), // Simula el método 'eq' que devuelve a sí mismo
//     data: [], // Simula los datos devueltos por la consulta
//   };
  
//   // Simula la importación de Supabase y asigna el objeto simulado
//   jest.mock('@supabase/supabase-js', () => ({
//     createClient: jest.fn(() => mockSupabase), // Simula la creación del cliente Supabase
//   }));


  

//   // Mock de bcrypt.hash() y jwt.sign()
// jest.mock('bcrypt');
// jest.mock('jsonwebtoken');

// describe('postNewUser', () => {
//   let req, resp;

//   beforeEach(() => {
//     req = {
//       body: {},
//     };
//     resp = {
//       status: jest.fn(() => resp),
//       json: jest.fn(),
//     };
//   });

//   beforeEach(() => {
//     jest.clearAllMocks(); // Limpiamos todos los mocks entre cada test
//   });

//   it('debería generar un token JWT válido al registrar un nuevo usuario', async () => {
//     req.body.email = 'test@example.com';
//     req.body.password = 'password1234';

//     // Simulamos que no existe un usuario con este email en Supabase
//     mockSupabase.from().select().eq().data = [];

//     // Simulamos una inserción exitosa de usuario en Supabase
//     const newUser = { email: req.body.email, password: req.body.password };
//     mockSupabase.from().insert.mockResolvedValue({ data: [newUser] });

//     // Mock de bcrypt.hash() para devolver una contraseña hash simulada
//     const hashedPassword = 'hashed_password';
//     bcrypt.hash.mockResolvedValue(hashedPassword);

//     // Mock de jwt.sign() para devolver un token JWT simulado
//     const token = 'fake_token';
//     jwt.sign.mockReturnValue(token);

//     // Realizamos la solicitud para registrar un nuevo usuario
//     const response = await request(app)
//       .post('/api/v1/users')
//       .send({ email: req.body.email, password: req.body.password });

//     // Verificamos que la respuesta tenga un estado 201 (creado)
//     expect(response.status).toBe(201);

//     // Verificamos que la respuesta incluya un token JWT
//     expect(response.body).toHaveProperty('token', token);

//     // Verificamos que bcrypt.hash() fue llamado con la contraseña del usuario
//     expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, expect.any(Number));

//     // Verificamos que jwt.sign() fue llamado con la información del usuario
//     expect(jwt.sign).toHaveBeenCalledWith({ email: req.body.email }, secret, { expiresIn: '1h' });
//   });
// });
  
});