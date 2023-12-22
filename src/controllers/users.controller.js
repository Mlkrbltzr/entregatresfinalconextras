// Importa las clases necesarias
import UserDAO from '../DAO/classes/user.dao.js';
import UserDTO from '../DAO/DTO/users.DTO.js';

// Crea una instancia del servicio de usuario
const userService = new UserDAO();

/**
 * Obtiene todos los usuarios.
 */
export const getUsers = async (req, res) => {
  try {
    // Obtiene la lista de todos los usuarios
    const result = await userService.getUsers();
    // Envía la respuesta con el estado 'success' y los resultados obtenidos
    res.send({ status: 'success', result: result });
  } catch (error) {
    // En caso de error, envía una respuesta con el estado 'error'
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
    // Busca un usuario por su ID
    const user = await userService.getUserById(uid);
    // Envía la respuesta con el estado 'success' y el usuario encontrado
    res.send({ status: 'success', result: user });
  } catch (error) {
    // En caso de error, envía una respuesta con el estado 'error'
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
    // Obtiene los datos del usuario desde el cuerpo de la solicitud
    const userData = req.body;
    // Crea un DTO de usuario a partir de los datos recibidos
    const userDTO = new UserDTO(userData);
    // Realiza validaciones adicionales si es necesario
    // userDTO.validate();
    // Guarda el nuevo usuario
    const result = await userService.saveUser(userDTO);
    // Envía la respuesta con el estado 'success' y el resultado de la operación
    res.send({ status: 'success', result });
  } catch (error) {
    // En caso de error, envía una respuesta con el estado 'error'
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
  // Obtiene los datos del cuerpo de la solicitud
  const { userId, productId, quantity } = req.body;

  // Función processPurchase movida aquí
  const processPurchase = async (cart, user) => {
    // Lógica para procesar la compra y verificar el stock (implementa según tus necesidades)
    // ...

    // Ejemplo: actualiza el stock de los productos en la base de datos
    // await ProductService.updateStock(cart.products);

    // Devuelve información sobre la compra (éxito o falla)
    return {
      success: true, // o false si la compra no se completó
      failedProductIds: [/* IDs de los productos que no pudieron procesarse */],
      // Otra información necesaria para el ticket
    };
  };

  try {
    // Verifica si se está realizando una acción específica ("addToCart")
    if (userId === "addToCart") {
      // Realiza la lógica específica para el caso "addToCart"
      // Puedes crear un carrito temporal o realizar alguna otra acción
      // ...

      // Envía una respuesta exitosa con el resultado específico para "addToCart"
      res.send({ status: 'success', result: {} });
    } else {
      // Busca el usuario por ID y agrega el producto al carrito
      const user = await userService.addToCart(userId, productId, quantity);

      // Si el usuario existe, también procesa la compra
      if (user) {
        // Llama a la función processPurchase para procesar la compra
        const purchaseData = await processPurchase(user.cart, user);

        // Actualiza el carrito del usuario con los productos que no pudieron comprarse
        await userService.updateUserCart(userId, purchaseData.failedProductIds);

        // Envía una respuesta exitosa con el resultado de la compra
        res.send({ status: 'success', result: purchaseData });
      } else {
        // En caso de que el usuario no se encuentre, envía un error 404
        res.status(404).send({ status: 'error', error: 'User not found' });
      }
    }
  } catch (error) {
    // En caso de error, envía una respuesta con el estado 'error'
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
    // En caso de error, envía una respuesta con el estado 'error'
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error fetching current user' });
  }
};
