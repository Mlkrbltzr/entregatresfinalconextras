import express from 'express';
import { getCurrentUser, getUserById, saveUser, addToCart } from '../controllers/users.controller.js';

const router = express.Router();

// Ruta para obtener información del usuario actual
router.get('/current', getCurrentUser);

// Otras rutas de usuarios
router.get('/:uid', getUserById);
router.post('/', saveUser);

// Ruta para agregar un producto al carrito
router.post('/addToCart', addToCart);

export default router;