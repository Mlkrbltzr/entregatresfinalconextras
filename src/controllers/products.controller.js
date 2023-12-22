// products.controller.js

// Importa la clase ProductService y el logger
import ProductService from '../services/product.service.js';
import logger from './logger.js';

// Crea una instancia de ProductService
const productService = new ProductService();

// Controlador para obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    // Obtiene todos los productos usando el servicio ProductService
    const products = await productService.getAllProducts();
    // Envía una respuesta exitosa con la lista de productos
    res.send({ status: 'success', result: products });
  } catch (error) {
    // En caso de error, registra el error y envía una respuesta de error al cliente
    logger.error(error);
    res.status(500).send({ status: 'error', error: 'Error fetching products' });
  }
};

// Controladores CRUD para productos
export const addProduct = async (req, res) => {
    const product = req.body;
  
    try {
      // Agrega un nuevo producto usando el servicio ProductService
      const result = await productService.addProduct(product);
      // Envía una respuesta exitosa con el resultado de la operación
      res.status(200).json({ status: 'success', result: result });
    } catch (error) {
      // En caso de error, registra el error y envía una respuesta de error al cliente
      console.error('Error al agregar producto:', error);
      res.status(500).json({ status: 'error', error: 'No se puede agregar producto' });
    }
  };
  
  // Agrega más controladores CRUD según sea necesario...
  // Controlador para verificar la existencia de un producto por su ID
export const exist = async (req, res) => {
    const { productId } = req.params;
  
    try {
      // Verifica la existencia del producto usando el servicio ProductService
      const result = await productService.exist(productId);
      // Envía una respuesta exitosa con el resultado de la verificación
      res.status(200).json({ status: 'success', result: result });
    } catch (error) {
      // En caso de error, registra el error y envía una respuesta de error al cliente
      console.error('Error al verificar la existencia del producto:', error);
      res.status(500).json({ status: 'error', error: 'Error al verificar la existencia del producto' });
    }
  };