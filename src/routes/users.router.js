//users.router.js
import express from 'express';
import passport from 'passport';
import * as usersControllers from '../controllers/users.controller.js';
import { authToken } from '../utils.js';

const router = express.Router();

// Obtener todos los usuarios
router.get("/users", usersControllers.getAllUsers);

// Obtener un usuario por ID
router.get("/users/:uid", usersControllers.getUserById);

// Crear un nuevo usuario
router.post("/api/users", usersControllers.createUser);

// Registrar un usuario y guardar un mensaje
router.post("/register", usersControllers.registerUserAndMessage);

// Iniciar sesión de usuario
router.post("/login", usersControllers.loginUser);

// Obtener información del usuario autenticado
router.get("/api/sessions/user", passport.authenticate("current", { session: false }), usersControllers.getUserInfo);

// Cerrar sesión de usuario
router.get("/logout", usersControllers.logoutUser);

// Actualizar información de usuario
router.put("/users/:uid", usersControllers.updateUser);

// Eliminar un usuario por ID
router.delete("/users/:uid", usersControllers.deleteUser);

// Recuperar contraseña
router.post("/recoverypass", usersControllers.recuperacionCorreo);

// Actualizar contraseña por correo electrónico
router.post("/actualizar-pass", usersControllers.updatePasswordByEmail);

// Cambiar el rol de un usuario a premium
router.post("/api/users/premium/:uid", usersControllers.changeRol);

export default router;
