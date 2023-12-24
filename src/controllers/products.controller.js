//products.controller.js
import ProductDao from "../DAO/mongo/products.mongo.js"; // Importa el DAO de productos
import { ProductCreationError } from "../Errors/customErrors.js";
import logger from "../logger.js";

// Se instancia la clase de productos
const productDao = new ProductDao();

// Función para obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        // Obtiene parámetros de consulta (query parameters)
        // Aquí se extraen tres parámetros: page, limit, y sortBy.
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sortBy = req.query.sortBy || "price";
        
        // parseInt se utiliza para convertir los valores de los parámetros de consulta a números enteros. Si no se proporciona un parámetro específico, se establece un valor predeterminado (page=1, limit=20 y sortBy="price").
        const options = { page: page, limit: limit, sort: { [sortBy]: 1 } };
        
        // Productos paginados desde el DAO (Data Access Object). El DAO realiza una consulta a la base de datos para obtener los productos según las opciones proporcionadas.
        const result = await productDao.getPaginatedProducts(options);

        // Condición: si NO encuentra los productos, retorna un error 
        if (!result.products.length) {
            return res.status(404).json({ message: "Productos no encontrados" });
        }

        // Si todo sale bien, muestra los productos
        res.json({
            products: result.products,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
        });

        // Si todo sale mal, muestra el error máximo
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

// Obtener un producto específico según ID 
export const getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
        const result = await productDao.getProductById(productId);
        if (!result) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            const formattedProduct = {
                title: result.title,
                description: result.description,
                code: result.code,
                price: result.price,
                stock: result.stock,
                category: result.category,
                quantity: result.quantity,
                // Agregar más propiedades si se necesita
            };
            res.render("productDetail", { product: formattedProduct });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: "Algo salió mal, intenta más tarde" });
    }
};

// Función para crear un nuevo producto y función para verificar si el producto es válido antes de crearlo
export const saveProduct = async (req, res) => {
    const newProduct = req.body;
    try {
        if (!isValidProduct(newProduct)) {
            throw new ProductCreationError("Datos del producto inválidos"); 
        }

        // Asigna el usuario autenticado al producto antes de guardarlo
        newProduct.owner = req.user.email; // Asigna el email del usuario autenticado al campo owner del producto

        const result = await productDao.saveProduct(newProduct);
        logger.info("Producto creado correctamente:", result);
        res.json({ status: "success producto creado", result: result });
    } catch (error) {
        if (error instanceof ProductCreationError) {
            logger.error("Error al crear el producto:", error.message);
            res.status(error.statusCode).send({ status: "error", error: error.message });
        } else {
            logger.error("Error general al crear el producto:", error);
            console.error(error);
            res.status(500).send({ status: "error", error: "Algo salió mal, intenta más tarde" });
        }
    }
};

// Actualizar un producto específico según ID
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;
    
    // Intenta acceder a un producto específico de la base de datos y mediante Postman se modifica lo que se requiere y lo que no se mantiene tal cual está 
    try {
        const result = await productDao.updateProduct(productId, updatedProduct);
        logger.info("Producto actualizado correctamente:", result);
        res.json({ status: "success producto actualizado", result: result });
    } catch (error) {
        logger.error("Error al actualizar el producto:", error);
        console.log(error);
        res.status(500).send({ status: "error", error: "Algo salió mal, intenta más tarde" });
    }
};

// Eliminar un producto específico según ID
export const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const user = req.user; // Usuario autenticado

    try {
        // Buscar el producto por su ID
        const product = await productDao.getProductById(productId);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Verifica si el usuario creó el producto
        if (user.rol === "premium" && product.owner !== user.email) {
            return res.status(403).json({ message: "No tienes permisos para eliminar este producto" });
        }

        const result = await productDao.deleteProduct(productId);
        logger.info("Producto eliminado correctamente:", result);
        res.json({ status: "success producto eliminado", result: result });
    } catch (error) {
        logger.error("Error al eliminar el producto:", error);
        console.log(error);
        res.status(500).send({ status: "error", error: "Algo salió mal, intenta más tarde" });
    }
};

function isValidProduct(product) {
    // Primero valida que product sea un objeto 
    if (!product || typeof product !== "object") {
        return false;
    }

    // Se desestructura el objeto product para obtener cada propiedad
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    } = product;

    // Validación de tipo string o number en cada propiedad
    if (
        typeof title === "string" &&
        typeof description === "string" &&
        typeof code === "string" &&
        typeof price === "number" &&
        typeof stock === "number" &&
        typeof category === "string" &&
        typeof thumbnails === "string"
    ) {
        return true;
    } else {
        return false;
    }
    // Si se cumplen las validaciones, retorna true (producto válido y continúa con la función saveProduct)
}
