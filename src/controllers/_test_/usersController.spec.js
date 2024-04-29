const { postNewUser } = require("../usersController");


// Mock del cliente Supabase
jest.mock("@supabase/supabase-js", () => {
  let testData = []; // Inicialmente no hay usuarios en la base de datos simulada
  return {
    createClient: jest.fn().mockImplementation(() => {
      return {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockImplementation(() => ({
          eq: jest.fn().mockReturnThis(),
          data: testData, // Devuelve los datos simulados
          error: null,
        })),
        insert: jest.fn().mockImplementation(() => ({
          data: testData, // Devuelve los datos simulados
          error: null,
        })),
      };
    }),
    setTestData: (newData) => {
      testData = newData;
    },
  };
});
describe("postNewUser", () => {
  beforeEach(() => {
    const { setTestData } = require("@supabase/supabase-js");
    setTestData([]); // Restablece los datos simulados antes de cada prueba
  });
  it("Deberia crear un nuevo usuario", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    const resp = {
      status: jest.fn(() => resp),
      json: jest.fn(),
    };
    await postNewUser(req, resp);
    // Verifica que se haya llamado al método insert del cliente Supabase
    expect(resp.status).toHaveBeenCalledWith(201);
    expect(resp.json).toHaveBeenCalledWith({ newUser: expect.anything() });
  });

  it('Deberia retornar 403 si el usuario existe', async () => {
    // Define los datos del usuario existente
    const existingUserEmail = 'existing@example.com';
    const existingUser = {
      email: existingUserEmail,
      password: 'hashedPassword',
    };
    // Simula la existencia del usuario en la base de datos
    const { setTestData } = require('@supabase/supabase-js');
    setTestData([existingUser]);
    // Define la solicitud con el correo electrónico del usuario existente
    const req = {
      body: {
        email: existingUserEmail,
        password: 'password123',
      },
    };
    // Define la respuesta del servidor
    const resp = {
      status: jest.fn(() => resp),
      json: jest.fn(),
    };
    // Ejecuta la función para crear un nuevo usuario
    await postNewUser(req, resp);
    // Verifica que la función haya respondido con el status 403
    expect(resp.status).toHaveBeenCalledWith(403);
    expect(resp.json).toHaveBeenCalledWith({ error: 'El usuario ya existe' });
  });
  
  it("Deberia retornar 400 si email o password faltan", async () => {
    const reqMissingFields = {
      body: {
        email: "",
        password: "",
      },
    };
    const resp = {
      status: jest.fn(() => resp),
      json: jest.fn(),
    };
    await postNewUser(reqMissingFields, resp);
    // Verifica que se haya devuelto el error 400
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: "Completar campos" });
  });

  let req, resp;

  beforeEach(() => {
    req = {
      body: {},
    };
    resp = {
      status: jest.fn(() => resp),
      json: jest.fn(),
    };
    
  });

  it("debería retornar un error si la contraseña es demasiado corta", async () => {
    req.body.email = "test@example.com";
    req.body.password = "abc";

    await postNewUser(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({
      error: "La contraseña debe tener un mín de 4 caracteres", 
    });
  });

  it("debería retornar un error si el formato del correo electrónico es inválido", async () => {
    req.body.email = "invalidemail";
    req.body.password = "password1234";

    await postNewUser(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({
      error: "Formato de correo electrónico no válido",
    });
  });
});
