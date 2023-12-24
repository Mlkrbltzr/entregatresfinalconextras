//products.mongo.js
import { productModel } from "./models/products.model.js";

class ProductDao {
    // Obtener todos los productos
    async getProducts() {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        try {
            const product = await productModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Guardar un nuevo producto
    async saveProduct(product) {
        try {
            const result = await productModel.create(product);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Actualizar un producto por su ID
    async updateProduct(id, product) {
        try {
            const result = await productModel.updateOne({ _id: id }, { $set: product });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            const result = await productModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

// Exportar la clase ProductDao
export default ProductDao;
