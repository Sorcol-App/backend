require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost/mi-aplicacion',
    jwtSecret: process.env.JWT_SECRET || 'mi-secreto-jwt',
  };
  