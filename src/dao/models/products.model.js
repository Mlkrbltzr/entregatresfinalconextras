import mongoose from "mongoose";

const productCollection = "products";

let productModel; // Declarar la variable del modelo fuera del bloque try-catch

try {
  // Intentar cargar el modelo solo si aún no ha sido cargado
  productModel = mongoose.model(productCollection);
} catch (error) {
  // Si el modelo aún no existe, compílalo y asígnalo a la variable
  productModel = mongoose.model(productCollection, mongoose.Schema({
    product: String,
    description: String,
    price: Number,
  }));
}

export default productModel;
