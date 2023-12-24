// Define una clase UserDTO para representar la información de un usuario
export default class UserDTO {
  // Constructor de la clase que toma un objeto 'user' como parámetro
  constructor(user) {
    // Asigna el valor de 'user.nombre' a 'this.nombre' o una cadena vacía si no está definido
    this.nombre = user.nombre || '';

    // Asigna el valor de 'user.apellido' a 'this.apellido' o una cadena vacía si no está definido
    this.apellido = user.apellido || '';

    // Asigna el valor de 'user.email' a 'this.email' o una cadena vacía si no está definido
    this.email = user.email || '';

    // Asigna el valor de 'user.password' a 'this.password' o una cadena vacía si no está definido
    this.password = user.password || '';

    // Asigna el valor de 'user.isGithubAuth' a 'this.isGithubAuth' o false si no está definido
    this.isGithubAuth = user.isGithubAuth || false;

    // Asigna el valor de 'user.cartId' a 'this.cartId' o null si no está definido
    this.cartId = user.cartId || null;

    // Asigna el valor de 'user.rol' a 'this.rol' o 'user' si no está definido
    this.rol = user.rol || 'user';
  }
}
