//cart.repository.js
// Importar la clase CartDao
import CartDao from "../DAO/mongo/carts.mongo.js";

// Definir la clase CartRepository
class CartRepository {
    // Constructor de la clase que recibe un objeto dao
    constructor(dao) {
        this.dao = dao;
    }

    // Obtener un carrito por ID
    async getCartById(cartId) {
        try {
            const cart = await this.dao.getCartById(cartId);
            if (!cart) {
                return { message: "Carrito no encontrado" };
            }
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el carrito");
        }
    }

    // Obtener todos los carritos
    async getAllCarts() {
        try {
            const carts = await this.dao.getAllCarts();
            if (!carts) {
                return { message: "No se encontraron carritos" };
            }
            return carts;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener todos los carritos");
        }
    }

    // Crear un nuevo carrito
    async createCart(newCart) {
        try {
            const cart = await this.dao.createCart(newCart);
            if (!cart) {
                throw new Error("Error al crear el carrito");
            }
            return { message: "Carrito creado", cart };
        } catch (error) {
            console.error(error);
            throw new Error("Error al crear el carrito");
        }
    }

    // Agregar productos al carrito
    async addProductToCart(cartId, productIds) {
        try {
            const result = await this.dao.addProductToCart(cartId, productIds);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar productos al carrito");
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const result = await this.dao.updateProductQuantity(cartId, productId, newQuantity);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    // Eliminar un carrito por ID
    async deleteCartById(cartId) {
        try {
            const result = await this.dao.deleteCartById(cartId);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar el carrito");
        }
    }

    // Eliminar todos los productos de un carrito
    async deleteAllProductsInCart(cartId) {
        try {
            const result = await this.dao.deleteAllProductsInCart(cartId);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar todos los productos del carrito");
        }
    }

    // Eliminar un producto de un carrito por ID
    async deleteProductFromCart(cartId, productId) {
        try {
            const result = await this.dao.deleteProductFromCart(cartId, productId);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar el producto del carrito");
        }
    }
}

// Exportar la clase CartRepository
export default CartRepository;
