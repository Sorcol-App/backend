const { MongoClient } = require("mongodb");
const config = require("./config");

// eslint-disable-next-line no-unused-vars
const { databaseUrl } = config;
const options = {
  connectTimeoutMS: 3000,
  socketTimeoutMS: 3000,
  serverSelectionTimeoutMS: 3000,
};
const client = new MongoClient(config.databaseUrl, options);

async function connect() {
    try {
      await client.connect();
      const db = client.db("sorcol_prueba");
      console.log("Conexión establecida con la base de datos");
      return db;
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
      throw error; // Reenvía el error para que se maneje en el archivo index.js
    }
  }


module.exports = { connect };