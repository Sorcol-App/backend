const request = require("supertest");
const app = require("../../../index"); // Importa tu aplicación Express
const { postNewUser } = require("../usersController");
const supabase = require("../../../connect"); // Importa tu configuración de Supabase aquí
const bcrypt = require("bcrypt");


describe("postNewUser", () => {
  const mockSupabase = {
    from: jest.fn(() => mockSupabase),
    insert: jest.fn().mockResolvedValue(), // Devolver una promesa resuelta con los datos del usuario creado

    select: jest.fn().mockReturnThis(), // Simula el método 'select' que devuelve a sí mismo
    eq: jest.fn().mockReturnThis(), // Simula el método 'eq' que devuelve a sí mismo
    data: [],
    single: jest.fn().mockReturnThis(), // Simula los datos devueltos por la consulta
  };

  // Simula la importación de Supabase y asigna el objeto simulado
  jest.mock("@supabase/supabase-js", () => ({
    createClient: jest.fn(() => mockSupabase), // Simula la creación del cliente Supabase
  }));

  jest.mock("bcrypt", () => ({
    hash: jest.fn(),
  }));

  describe("postNewUser", () => {
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

    it("debería retornar un error si faltan campos", async () => {
      await postNewUser(req, resp);
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({ error: "Completar campos" });
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

    it("debería retornar un error si el usuario ya existe en Supabase", async () => {
      // Simula que existe un usuario con el mismo email en Supabase
      mockSupabase.from().select().eq().data = [
        { email: "existinguser@example.com" },
      ];

      const response = await request(app)
        .post("/api/v1/users")
        .send({ email: "existinguser@example.com", password: "password1234" });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: "El usuario ya existe" });
    });

    it("deberia crear un nuevo usuario en supaBase", async () => {
      req.body.email = "prueba@example.com";
      req.body.password = "123456";

      mockSupabase.from().select().eq().data = [];

      const hashedPassword = "hashed_password";
      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      const userData = { email: req.body.email, password: hashedPassword };
      mockSupabase.from().insert.mockResolvedValue({ data: [userData] });
      console.log(userData);

      const response = await request(app).post("/api/v1/users").send(userData);
      console.log(userData);

      // Comprobar la respuesta exitosa
      expect(response.status).toBe(201);

      // Verificar la creación del usuario en Supabase
      const createdUser = await mockSupabase
        .from("users")
        .select()
        .eq("email", userData.email)
        .single();
      console.log(createdUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
    });

    
  });
});
