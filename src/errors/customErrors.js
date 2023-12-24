//customErros.js
// Clase de error personalizada para errores en la creación de productos
class ProductCreationError extends Error {
    // Constructor de la clase
    constructor(message, statusCode) {
        super(message); // Llama al constructor de la clase Error con el mensaje proporcionado
        this.statusCode = statusCode || 500; // Establece el código de estado predeterminado en 500 si no se proporciona uno
        this.name = this.constructor.name; // Establece el nombre de la clase como el nombre del constructor
        Error.captureStackTrace(this, this.constructor); // Captura la pila de llamadas para obtener un rastreo de la llamada
    }
}

// Clase de error personalizada para errores al agregar productos al carrito
class AddProductToCart extends Error {
    // Constructor de la clase
    constructor(message, statusCode) {
        super(message); // Llama al constructor de la clase Error con el mensaje proporcionado
        this.statusCode = statusCode || 500; // Establece el código de estado predeterminado en 500 si no se proporciona uno
        this.name = this.constructor.name; // Establece el nombre de la clase como el nombre del constructor
        Error.captureStackTrace(this, this.constructor); // Captura la pila de llamadas para obtener un rastreo de la llamada
    }
}

// Exporta ambas clases de error
export { ProductCreationError, AddProductToCart };
