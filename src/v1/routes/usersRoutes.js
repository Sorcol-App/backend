const express = require('express');
const router = express.Router();
//const { postUser } = require('../../controllers/usersController');
const usersController = require('../../controllers/usersController');
// Ruta para registrar un nuevo usuario
router.get('/', usersController.getAllUsers);

router.get('/:userId', usersController.getUserId);
// Ruta para iniciar sesión
//router.post('/login', userController.loginUser);

// Otras rutas relacionadas con usuarios...
router.post('/', usersController.postNewUser);

module.exports = router;
