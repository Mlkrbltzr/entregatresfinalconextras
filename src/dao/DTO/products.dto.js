// Define una clase ProductDTO para representar la información de un producto
export default class ProductDTO {
  // Constructor de la clase que toma un objeto 'product' como parámetro
  constructor(product) {
    // Asigna el valor de 'product.title' a 'this.title' o una cadena vacía si no está definido
    this.title = product.title || '';

    // Asigna el valor de 'product.description' a 'this.description' o una cadena vacía si no está definido
    this.description = product.description || '';

    // Asigna el valor de 'product.code' a 'this.code' o una cadena vacía si no está definido
    this.code = product.code || '';

    // Asigna el valor de 'product.price' a 'this.price' o 0 si no está definido
    this.price = product.price || 0;

    // Asigna el valor de 'product.stock' a 'this.stock' o 0 si no está definido
    this.stock = product.stock || 0;

    // Asigna el valor de 'product.category' a 'this.category' o una cadena vacía si no está definido
    this.category = product.category || '';

    // Asigna el valor de 'product.thumbnails' a 'this.thumbnails' o una cadena vacía si no está definido
    this.thumbnails = product.thumbnails || '';

    // Asigna el valor de 'product.quantity' a 'this.quantity' o 1 si no está definido
    this.quantity = product.quantity || 1;
  }
}
