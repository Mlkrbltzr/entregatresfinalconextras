//cart.controller.js
import CartDao from "../DAO/mongo/carts.mongo.js";
import ProductDao from "../DAO/mongo/products.mongo.js";
import mongoose from "mongoose";
import { ticketModel } from "../DAO/mongo/models/ticket.model.js";
import { AddProductToCart } from "../Errors/customErrors.js";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import { PRIVATE_KEY } from "../utils.js";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "./users.controller.js";
import { userDao } from "./users.controller.js";
import logger from "../middleware/logger.js";


// Se instancia la clase del carrito
const cartDao = new CartDao();
const productDao = new ProductDao();

/**
 * Función para obtener un carrito específico según el ID.
 */
/* async function getCartById(req, res) {
    try {
        const cartId = req.params.cid;
        console.log(cartId)
        const cart = await cartDao.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.render("cartDetail", { cart }); // Renderizar la vista con los datos del carrito
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "Tenemos un 33-12" });
    }
} */

/**
 * Ruta para obtener el ID del carrito del usuario para usar con el botón "Mi carrito".
 */
async function getUserCart(req, res) {
    try {
        const userEmail = req.user.email;

        // Buscar al usuario en la base de datos usando el correo electrónico
        const user = await getUserByEmail(userEmail);

        if (!user) {
            logger.warn("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si el cartId es un ObjectId válido
        const isValidObjectId = mongoose.Types.ObjectId.isValid(user.cartId);
        if (!isValidObjectId) {
            logger.error("ID de carrito no válido");
            return res.status(400).json({ message: "ID de carrito no válido" });
        }

        // Continuar con la búsqueda del carrito utilizando el ID obtenido
        const cart = await cartDao.getCartById(user.cartId);

        if (!cart) {
            logger.warn("Carrito no encontrado");
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        logger.info("Carrito encontrado:", cart);
        return res.status(200).json({ cartId: user.cartId }); // Devolver el ID del carrito
    } catch (error) {
        logger.error("Error al obtener el carrito del usuario:", error);
        console.error("Error al obtener el carrito del usuario:", error);
        return res.status(500).json({ message: "Error al obtener el carrito del usuario." });
    }
}

/**
 * Función para obtener todos los carritos.
 */
async function getAllCarts(req, res) {
    try {
        const carts = await cartDao.getAllCarts();
        if (!carts) {
            logger.warn("No se encontraron carritos");
            return res.status(404).json({ message: "No se encontraron carritos" });
        }

        logger.info("Carritos encontrados:", carts);
        return res.json(carts);
    } catch (error) {
        logger.error("Error al obtener los carritos:", error);
        console.error(error);
        return res.status(500).json({ status: "error", error: "Tenemos un 33-12" });
    }
}

/**
 * Función para crear un carrito.
 */
async function createCart(req, res) {
    try {
        const newCart = req.body;
        const cart = await cartDao.createCart(newCart);
        if (!cart) {
            return res.status(500).json({ message: "Error al crear el carrito" });
        }
        return res.json({ message: "Carrito creado", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "Tenemos un 33-12" });
    }
}

/**
 * Función para verificar si un carrito es válido.
 * @param {string} cart - ID del carrito.
 * @returns {boolean} - Indica si el carrito es válido o no.
 */
async function isvalidcart(cart) {
    const cartBd = await cartDao.getCartById(cart);
    return !!cartBd;
}

/**
 * Función para verificar si un ID de carrito es válido.
 * @param {string} id - ID del carrito.
 * @returns {boolean} - Indica si el ID del carrito es válido o no.
 */
async function isValidCartId(id) {
    return typeof id === "string";
}

/**
 * Función para agregar varios productos al carrito.
 */
async function addProductsToCart(req, res) {
    try {
        const cartId = req.params.cid;
        const products = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            logger.warn("Formato de productos no válido");
            return res.status(400).json({ message: "Formato de productos no válido" });
        }

        if (!(await isValidCartId(cartId))) {
            logger.error("ID de carrito no válido");
            throw new AddProductToCart("ID de carrito no válido", 400);
        }

        if (!(await isvalidcart(cartId))) {
            logger.error("El carrito no existe");
            throw new AddProductToCart("El carrito no existe", 404);
        }

        // Obtener el usuario del objeto req
        const user = req.user;

        for (const product of products) {
            const { productId, quantity } = product;
            if (quantity < 1) {
                logger.error("La cantidad debe ser 1 o más");
                throw new AddProductToCart("La cantidad debe ser 1 o más", 400);
            }

            const productInfo = await productDao.getProductById(productId);
            if (user.rol === "premium" && productInfo.owner === user.email) {
                logger.error("No puedes agregar tus propios productos al carrito");
                throw new AddProductToCart("No puedes agregar tus propios productos al carrito", 403);
            }
        }

        const result = await cartDao.addProductsToCart(cartId, products);
        return res.json(result);
    } catch (error) {
        if (error instanceof AddProductToCart) {
            console.error("Error al agregar productos al carrito:", error.message);
            return res.status(error.statusCode).json({ status: 'error', error: error.message });
        } else {
            logger.error("Algo salió mal, intenta mas tarde:", error);
            console.error(error);
            return res.status(500).json({ status: "error", error: "Algo salió mal, intenta mas tarde:" });
        }
    }
}

/**
 * Función para actualizar la cantidad de un producto en el carrito.
 */
async function updateProductQuantity(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        const result = await cartDao.updateProductQuantity(cartId, productId, newQuantity);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "Tenemos un 33-12" });
    }
}

/**
 * Función para eliminar un carrito por su ID.
 */
async function deleteCartById(req, res) {
    try {
        const cartId = req.params.id;
        const result = await cartDao.deleteCartById(cartId);
        logger.info(`Carrito con ID ${cartId} eliminado exitosamente`);
        return res.json(result);
    } catch (error) {
        logger.error("Error al eliminar el carrito:", error);
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el carrito" });
    }
}

/**
 * Función para eliminar todos los productos de un carrito.
 */
async function deleteAllProductsInCart(req, res) {
    try {
        const cartId = req.params.cid;
        const result = await cartDao.deleteAllProductsInCart(cartId);
        logger.info(`Todos los productos del carrito con ID ${cartId} fueron eliminados`);
        return res.json(result);
    } catch (error) {
        logger.error("Error al eliminar los productos del carrito:", error);
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar los productos del carrito" });
    }
}

/**
 * Función para eliminar un producto específico de un carrito.
 */
async function deleteProductFromCart(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await cartDao.deleteProductFromCart(cartId, productId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el producto del carrito" });
    }
}

/**
 * Función para generar un código aleatorio.
 * @returns {string} - Código aleatorio generado.
 */
function generateUniqueCode() {
    return uuidv4();
}

/**
 * Función para completar la compra del carrito.
 */
async function purchaseProducts(req, res) {
    const cartId = req.params.cid;
    const userEmail = req.user.email;

    try {
        const cartProducts = await cartDao.getCartProducts(cartId);
        const stock = await cartDao.checkStock(cartProducts);

        if (stock && stock.success === false) {
            return res.status(400).json({ message: stock.message });
        }

        const total = calculateTotal(cartProducts);
        const currentDate = new Date();
        const ticketData = {
            code: generateUniqueCode(),
            purchaser: userEmail,
            amount: total,
            products: cartProducts,
            purchase_datetime: currentDate,
        };

        const createdTicket = await cartDao.createTicket(ticketData);     //ticket de compra

        if (createdTicket) {
            await cartDao.deleteAllProductsInCart(cartId);
        }

        logger.info(`Compra exitosa de productos del carrito con ID ${cartId} por el usuario ${userEmail}`);
        return res.status(200).json({ ticket: createdTicket });
    } catch (error) {
        logger.error("Error al comprar productos del carrito:", error);
        console.error("Error al comprar productos del carrito:", error);
        return res.status(500).json({ message: 'Error al comprar productos del carrito.' });
    }
}

/**
 * Función para calcular el total de la compra.
 * @param {Array} cartProducts - Productos del carrito.
 * @returns {number} - Total de la compra.
 */
function calculateTotal(cartProducts) {
    let total = 0;
    for (const product of cartProducts) {
        total += product.price * product.quantity;
    }
    return total;
}

// Exportar funciones
export default {
    /* getCartById, */
    getAllCarts,
    createCart,
    addProductsToCart,
    updateProductQuantity,
    deleteCartById,
    deleteAllProductsInCart,
    deleteProductFromCart,
    purchaseProducts,
    getUserCart,
};