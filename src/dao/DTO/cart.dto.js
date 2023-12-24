// Define una clase CartDTO para representar la información del carrito de compras
export default class CartDTO {
    // Constructor de la clase que toma un objeto 'cart' como parámetro
    constructor(cart) {
      // Asigna el valor de 'cart.user' a 'this.user' o nulo si no está definido
      this.user = cart.user || null;
  
      // Asigna el valor de 'cart.products' a 'this.products' o un array vacío si no está definido
      this.products = cart.products || [];
  
      // Asigna el valor de 'cart.total' a 'this.total' o 0 si no está definido
      this.total = cart.total || 0;
    }
  }
  