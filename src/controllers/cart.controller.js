// cart.controller.js
import CartService from '../services/cart.service.js';
import logger from './logger.js';

const cartService = new CartService();

/**
 * Obtiene el carrito de un usuario por su ID.
 * @param {string} req.params.userId - ID del usuario.
 */
export const getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await cartService.getCartByUserId(userId);
    res.send({ status: 'success', result: cart });
  } catch (error) {
    handleControllerError(res, error, 'Error fetching cart');
  }
};

/**
 * Agrega un producto al carrito de un usuario.
 * @param {object} req.body - Datos de la solicitud.
 * @param {string} req.body.userId - ID del usuario.
 * @param {string} req.body.productId - ID del producto.
 * @param {number} req.body.quantity - Cantidad del producto.
 */
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    if (userId === 'addToCart') {
      // Lógica específica para 'addToCart'
      res.send({ status: 'success', result: {} });
    } else {
      const cart = await cartService.addToCart(userId, productId, quantity);
      res.send({ status: 'success', result: cart });
    }
  } catch (error) {
    handleControllerError(res, error, error.message);
  }
};

// Función para manejar errores comunes en los controladores
const handleControllerError = (res, error, errorMessage) => {
  logger.error(errorMessage);
  logger.error(error);
  res.status(500).send({ status: 'error', error: errorMessage });
};