
/*export const getUserById = async (req, res) => {
    const { uid } = req.params
    let user = await usersService.getUserById(uid)
    res.send({ status: "success", result: user })
}

export const saveUser = async (req, res) => {
    const user = req.body
    let result = await usersService.saveUser(user)
    res.send({ status: "success", result: result })
}*/
import UserDAO from '../dao/classes/user.dao.js';
import UserDTO from '../dao/DTO/users.DTO.js';

const userService = new UserDAO();

/**
 * Obtiene todos los usuarios.
 */
export const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers();
    res.send({ status: 'success', result: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error fetching users' });
  }
};

/**
 * Obtiene un usuario por su ID.
 * @param {string} req.params.uid - ID del usuario.
 */
export const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userService.getUserById(uid);
    res.send({ status: 'success', result: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error fetching user by ID' });
  }
};

/**
 * Guarda un nuevo usuario.
 * @param {object} req.body - Datos del usuario.
 */
export const saveUser = async (req, res) => {
  try {
    const userData = req.body;
    const userDTO = new UserDTO(userData);
    // Realizar validaciones adicionales si es necesario
    // userDTO.validate();
    const result = await userService.saveUser(userDTO);
    res.send({ status: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: 'error', error: error.message });
  }
};

/**
 * Agrega un producto al carrito de un usuario.
 * @param {object} req.body - Datos de la solicitud.
 * @param {string} req.body.userId - ID del usuario.
 * @param {string} req.body.productId - ID del producto.
 * @param {number} req.body.quantity - Cantidad del producto.
 */
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const user = await userService.addToCart(userId, productId, quantity);
    res.send({ status: 'success', result: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: error.message });
  }
};

/**
 * Obtener información del usuario actual.
 */
export const getCurrentUser = async (req, res) => {
  try {
    // Obtén el DTO del usuario desde la estrategia "current"
    const userDTO = req.user;

    // Crea un DTO simplificado con la información necesaria
    const simplifiedUserDTO = {
      first_name: userDTO.first_name,
      email: userDTO.email,
      rol: userDTO.rol,
      // ... otras propiedades necesarias
    };

    // Envía el DTO simplificado en la respuesta
    res.send({ status: 'success', result: simplifiedUserDTO });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error fetching current user' });
  }
};