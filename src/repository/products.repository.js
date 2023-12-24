//products.repository.js
// Importar la clase necesaria desde el archivo correspondiente
import ProductDao from '../DAO/mongo/products.mongo.js';

class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // Obtener productos paginados con opciones de página, límite y orden
    async getProducts(page = 1, limit = 20, sortBy = 'price') {
        try {
            // Configurar las opciones de paginación y orden
            const options = { page, limit, sort: { [sortBy]: 1 } };

            // Obtener productos paginados desde el DAO
            const result = await this.dao.getPaginatedProducts(options);

            // Verificar si se encontraron productos
            if (!result.products.length) {
                throw new Error('Productos no encontrados');
            }

            // Devolver los productos paginados y la información de paginación
            return {
                products: result.products,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener productos');
        }
    }

    // Obtener un producto por su ID
    async getProductById(productId) {
        try {
            // Obtener el producto desde el DAO por su ID
            const result = await this.dao.getProductById(productId);

            // Verificar si se encontró el producto
            if (!result) {
                throw new Error('Producto no encontrado');
            }

            // Devolver las propiedades del producto específicas necesarias
            return {
                title: result.title,
                description: result.description,
                code: result.code,
                price: result.price,
                stock: result.stock,
                category: result.category,
                quantity: result.quantity,
                // Agregar más propiedades si se necesitan
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener producto por ID');
        }
    }

    // Guardar un nuevo producto
    async saveProduct(newProduct) {
        try {
            // Guardar el nuevo producto utilizando el DAO
            const result = await this.dao.saveProduct(newProduct);
            return { status: 'success', result };
        } catch (error) {
            console.error(error);
            throw new Error('Error al guardar producto');
        }
    }

    // Actualizar un producto por su ID
    async updateProduct(productId, updatedProduct) {
        try {
            // Actualizar el producto utilizando el DAO
            const result = await this.dao.updateProduct(productId, updatedProduct);
            return { status: 'success', result };
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar producto');
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(productId) {
        try {
            // Eliminar el producto utilizando el DAO
            const result = await this.dao.deleteProduct(productId);
            return { status: 'success', result };
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar producto');
        }
    }
}

// Exportar la clase del Repositorio de Productos
export default ProductsRepository;
