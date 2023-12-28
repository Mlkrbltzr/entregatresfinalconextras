// Importar modelos
import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/products.model.js";
import { userModel } from "./models/user.model.js";
import { ticketModel } from "./models/ticket.model.js";

class CartDao {
    // Obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            console.log("Buscando carrito con ID:", cartId);

            // Buscar el carrito por ID y obtener la información detallada de los productos
            const cart = await cartModel.findOne({ _id: cartId })
                .populate({
                    path: 'products.product',
                    select: 'title price'
                })
                .lean();

            console.log("Carrito encontrado:", cart);
            return cart;
        } catch (error) {
            console.error("Error en getCartById:", error);
            return null;
        }
    }

    // Obtener todos los carritos
    async getAllCarts() {
        try {
            // Obtener todos los carritos de la base de datos
            const carts = await cartModel.find();
            return carts;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Crear un nuevo carrito
    async createCart(newCart) {
        try {
            // Crear un nuevo carrito con la información proporcionada
            const cart = await cartModel.create(newCart);
            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Agregar productos a un carrito existente
    async addProductsToCart(cartId, products) {
        try {
            // Buscar el carrito por ID
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }

            // Verificar si products es un array
            if (Array.isArray(products)) {
                // Iterar sobre los productos y agregarlos al carrito con sus cantidades
                for (const productData of products) {
                    const productId = productData.productId;
                    const quantity = productData.quantity;

                    // Verificar si la cantidad es un entero positivo
                    if (!Number.isInteger(quantity) || quantity < 1) {
                        return { success: false, message: 'La cantidad debe ser un entero positivo' };
                    }

                    // Buscar el producto por ID
                    const product = await productModel.findById(productId);
                    if (!product) {
                        return { success: false, message: `Producto ${productId} no encontrado` };
                    }

                    // Agregar el producto con su cantidad al carrito
                    cart.products.push({ product: productId, quantity });
                }
            } else {
                // Manejar si products no es un array
                return { success: false, message: 'Formato de productos no válido' };
            }

            // Guardar el carrito actualizado
            await cart.save();

            return { success: true, message: 'Productos agregados al carrito con cantidad' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al agregar productos al carrito con cantidad' };
        }
    }

    // Actualizar la cantidad de un producto en un carrito
    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            // Buscar el carrito por ID
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { success: false, message: 'Carrito no encontrado' };
            }

            // Verificar si newQuantity es un entero positivo
            if (!Number.isInteger(newQuantity) || newQuantity < 1) {
                return { success: false, message: 'La cantidad debe ser un entero positivo' };
            }

            // Buscar el índice del producto en el carrito
            const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
            if (productIndex === -1) {
                return { success: false, message: 'Producto no encontrado en el carrito' };
            }

            // Actualizar la cantidad del producto en el carrito
            cart.products[productIndex].quantity = newQuantity;
            await cart.save();

            return { success: true, message: 'Cantidad de producto actualizada en el carrito' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al actualizar la cantidad del producto en el carrito' };
        }
    }

    // Eliminar un carrito por su ID
    async deleteCartById(cartId) {
        try {
            // Buscar y eliminar el carrito por ID
            await cartModel.findByIdAndDelete(cartId);
            return { message: 'Carrito eliminado' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar el carrito' };
        }
    }

    // Eliminar todos los productos de un carrito
    async deleteAllProductsInCart(cartId) {
        try {
            // Buscar el carrito por ID
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            // Limpiar la lista de productos del carrito
            cart.products = [];
            await cart.save();

            return { message: 'Productos eliminados del carrito' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar los productos del carrito' };
        }
    }

    // Eliminar un producto específico de un carrito por su ID
    async deleteProductFromCart(cartId, productId) {
        try {
            // Buscar el carrito por ID
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            // Buscar el índice del producto en el carrito
            const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
            if (productIndex === -1) {
                return { error: 'Producto no encontrado en el carrito' };
            }

            // Obtener información del producto a eliminar
            const productToDelete = cart.products[productIndex];
            const productPrice = productToDelete.product.price;

            // Restar el precio del producto al total del carrito, si el precio es un número
            if (!isNaN(productPrice)) {
                cart.total = (cart.total || 0) - productPrice * productToDelete.quantity;
            }

            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
            await cart.save();

            return { message: 'Producto eliminado del carrito' };
        } catch (error) {
            console.error(error);
            return { error: 'Error al eliminar el producto del carrito' };
        }
    }

    // Obtener el carrito de un usuario por su ID
    async getUserCart(userId) {
        try {
            // Buscar el usuario por ID
            const user = await userModel.findById(userId);
            if (!user || !user.cartId) {
                return null;
            }

            // Obtener el ID del carrito asociado al usuario y buscar el carrito
            const cartId = user.cartId;
            const cart = await CartDao.getCartById(cartId);
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito del usuario');
        }
    }

    // Obtener los productos de un carrito por su ID
    async getCartProducts(cartId) {
        try {
            // Buscar el carrito por ID
            const cart = await cartModel.findById(cartId);
            const productIds = cart.products.map(product => product.product);

            // Obtener información completa de los productos a partir de los IDs
            const products = await productModel.find({ _id: { $in: productIds } });

            // Devolver la información completa de los productos
            return products;
        } catch (error) {
            console.error('Error al obtener productos del carrito:', error);
            throw error;
        }
    }

    // Función para verificar los IDs de los productos en la base de datos
    async checkProductIdsInDB(productIds) {
        try {
            // Buscar productos por sus IDs
            const products = await productModel.find({ _id: { $in: productIds } });
            console.log('Products found in DB:', products);
        } catch (error) {
            console.error('Error al buscar productos por IDs:', error);
            throw error;
        }
    }

    // Verificar el stock de productos en un carrito
    async checkStock(cartProducts) {
        try {
            console.log("Productos del carrito", cartProducts);
            for (const product of cartProducts) {
                console.log(`Verificando stock para producto ${product._id}`);

                // Buscar el producto en la base de datos
                const productInDB = await productModel.findById(product._id);

                if (!productInDB) {
                    console.log(`Producto ${product._id} no encontrado en la base de datos`);
                    return { success: false, message: "Producto no encontrado" };
                }

                const availableStock = productInDB.stock;

                // Verificar si hay suficiente stock para el producto
                if (product.quantity > availableStock) {
                    console.log(`Stock insuficiente para ${productInDB.title}`);
                    return { success: false, message: `Stock insuficiente para ${productInDB.title}` };
                }

                console.log(`Stock suficiente para ${productInDB.title}. Stock disponible: ${availableStock}`);

                // Restar la cantidad del carrito al stock del producto en la base de datos
                console.log(`Stock antes de la actualización para ${productInDB.title}: ${productInDB.stock}`);
                productInDB.stock -= product.quantity;
                await productInDB.save();
                console.log(`Stock después de la actualización para ${productInDB.title}: ${productInDB.stock}`);
            }

            return { success: true, message: 'Stock disponible para todos los productos' };
        } catch (error) {
            console.error('Error al verificar el stock de productos:', error);
            throw error;
        }
    }

    // Crear un ticket en la base de datos
    async createTicket(ticketData) {
        try {
            // Crear un nuevo ticket utilizando el ticketModel
            const ticket = new ticketModel(ticketData);
            const savedTicket = await ticket.save();
            return savedTicket;
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            return null;
        }
    }
}

// Exportar la clase CartDao
export default CartDao;
