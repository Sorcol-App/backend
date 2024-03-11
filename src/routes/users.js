const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Otras rutas relacionadas con usuarios...

module.exports = router;