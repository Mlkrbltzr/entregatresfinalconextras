//index.js
// Importar las clases necesarias desde los archivos correspondientes
import { Contacts, Products, Carts, Users } from '../DAO/factory.js';
import ContactRepository from './contacts.repository.js';
import ProductRepository from './products.repository.js';
import CartRepository from './cart.repository.js';
import UserRepository from './users.repository.js';

// Crear instancias de las clases de DAO y Repository
const contactService = new ContactRepository(new Contacts());
const productService = new ProductRepository(new Products());
const cartService = new CartRepository(new Carts());
const userService = new UserRepository(new Users());

// Exportar los servicios
export {
  contactService,
  productService,
  cartService,
  userService,
};
