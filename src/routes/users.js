const express = require('express');
const router = express.Router();
const {getUser} = require('../controllers/users');
const { supabase } = require('./connect');

// Ruta para registrar un nuevo usuario
router.get('/users', getUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Otras rutas relacionadas con usuarios...

module.exports = router;


