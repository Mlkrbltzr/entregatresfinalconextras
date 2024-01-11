// products.mongo.js

import { productModel } from "./models/products.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

class ProductDao {
    // Función para obtener productos paginados
    async getPaginatedProducts(options) {
        try {
            const { page, limit, sort } = options;
            // Utilizamos la función paginate de mongoosePaginate para obtener productos paginados
            const products = await productModel.paginate({}, { page, limit, sort });
            return products;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Función para obtener todos los productos
    async getProducts() {
        try {
            // Utilizamos la función find de mongoose para obtener todos los productos
            const products = await productModel.find();
            return products;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Función para obtener un producto por su ID
    async getProductById(id) {
        try {
            // Utilizamos la función findOne de mongoose para obtener un producto por su ID
            const product = await productModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Función para guardar un nuevo producto
    async saveProduct(product) {
        try {
            // Utilizamos la función create de mongoose para guardar un nuevo producto
            const result = await productModel.create(product);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Función para actualizar un producto por su ID
    async updateProduct(id, product) {
        try {
            // Utilizamos la función updateOne de mongoose para actualizar un producto por su ID
            const result = await productModel.updateOne({ _id: id }, { $set: product });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Función para eliminar un producto por su ID
    async deleteProduct(id) {
        try {
            // Utilizamos la función deleteOne de mongoose para eliminar un producto por su ID
            const result = await productModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

// Exportamos la clase ProductDao
export default ProductDao;
