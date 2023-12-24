//cart.model.js
// Importa el módulo mongoose para la interacción con MongoDB
import mongoose from "mongoose";

// Define el nombre de la colección en la base de datos
const cartsCollection = "carts";

// Define el esquema del carrito
const cartSchema = new mongoose.Schema({
  // Usuario asociado al carrito, referenciando la colección de usuarios
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  
  // Lista de productos en el carrito, cada uno con una referencia al producto y una cantidad
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number, default: 1 } // Ajusta el tipo de dato según tus necesidades
  }],
  
  // Total del carrito, un número requerido
  total: { type: Number, required: true }
});

// Crea un modelo de mongoose para la colección de carritos utilizando el esquema definido
const cartModel = mongoose.model(cartsCollection, cartSchema);

// Exporta el modelo del carrito para su uso en otras partes de la aplicación
export { cartModel };
