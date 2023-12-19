export default class UserDTO {
    constructor({ first_name, last_name, age, email, rol, password }) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.age = age;
      this.email = email;
      this.rol = rol;
      this.password = password;
    }
  
    // Puedes agregar métodos de validación o formateo según sea necesario
  }