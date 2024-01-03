// users.controller.js
import { userModel } from "../DAO/mongo/models/user.model.js";
import { cartModel } from "../DAO/mongo/models/cart.model.js";
import { messageModel } from "../DAO/mongo/models/messages.model.js";
import { createHash, isValidPassword, generateToken, generateTokenRecovery } from '../utils.js';
import bcrypt from "bcrypt";
import { transporter } from "../routes/mail.router.js";
import UserDao from "../DAO/mongo/users.mongo.js";
import logger from "../middleware/logger.js";

const userDao = new UserDao();

async function getUserByEmail(email) {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener usuario por correo electrónico");
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userModel.find();
    res.send({ result: "success", payload: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

async function getUserById(req, res) {
  const { uid } = req.params;
  try {
    const user = await userModel.findById(uid);
    if (!user) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }
    res.json({ status: "success", payload: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al obtener el usuario por ID" });
  }
}

async function createUser(req, res) {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ status: "error", error: "Faltan datos" });
  }

  try {
    const hashedPassword = createHash(password); // Nueva línea para obtener el hash de la contraseña
    const usuario = await userModel.create({ nombre, apellido, email, password: hashedPassword });
    res.json({ message: "Usuario creado con éxito", user: usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al crear el usuario", details: error.message });
  }
}

async function registerUserAndMessage(req, res) {
  const { nombre, apellido, email, password, message, rol } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ status: "error", error: "Faltan datos" });
  }

  try {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ status: "error", error: "El correo ya existe" });
    }

    const newCart = await cartModel.create({ user: null, products: [], total: 0 });
    const hashedPassword = createHash(password); // Nueva línea para obtener el hash de la contraseña
    const newUser = new userModel({ nombre, apellido, email, password: hashedPassword, rol: rol || "user", cartId: newCart._id });
    newUser.user = newUser._id;
    await newUser.save();

    newCart.user = newUser._id;
    await newCart.save();

    if (message) {
      const newMessage = new messageModel({ user: newUser._id, message });
      await newMessage.save();
    }

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al guardar usuario y mensaje" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    // Agrega logs para depuración
    console.log("Contraseña almacenada en la base de datos:", user.password);
    console.log("Contraseña proporcionada en la solicitud:", password);

    if (!user || !isValidPassword(user, password)) {
      logger.error("Usuario o contraseña incorrecta");
      console.log("User:", user);
      console.log("isValidPassword:", isValidPassword(user, password));
      return res.status(401).json({ message: "Usuario o contraseña incorrecta" });
    }

    const token = generateToken({ email: user.email, nombre: user.nombre, apellido: user.apellido, rol: user.rol });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    const userCart = await cartModel.findById(user.cartId);

    logger.info("Inicio de sesión exitoso para el usuario: " + user.email);
    logger.info("Token generado para el usuario: " + token);
    logger.info("rol del usuario: " + user.rol);

    res.status(200).json({ token, userCart });
  } catch (error) {
    res.status(500).json({ error: "Error al ingresar " + error.message });
  }
}

async function getUserInfo(req, res) {
  const user = req.user;
  res.json({ user });
}

async function logoutUser(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: "Error al desconectarse", body: error });
    }
    res.redirect("../../login");
  });
}

async function updateUser(req, res) {
  const { uid } = req.params;
  const userToReplace = req.body;
  try {
    const updateFields = { ...userToReplace };
    delete updateFields._id;

    const userUpdate = await userModel.findByIdAndUpdate(uid, updateFields, { new: true });

    if (!userUpdate) {
      logger.error("Usuario no encontrado al intentar actualizar");
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    logger.info("Usuario actualizado correctamente:", userUpdate);
    res.json({ status: "success", message: "Usuario actualizado", user: userUpdate });
  } catch (error) {
    logger.error("Error al actualizar el usuario:", error);
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al actualizar el usuario" });
  }
}

async function updatePasswordByEmail(req, res) {
  const { email, newPassword } = req.body;

  try {
    const user = await userDao.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "No se encontró el usuario" });
    }

    // Agrega logs para depuración
    console.log("Email del usuario:", user.email);
    console.log("Hash almacenado en la base de datos:", user.password);

    // Comparar la nueva contraseña con la anterior
    const matchOldPassword = await bcrypt.compare(newPassword, user.password);
    console.log("¿La nueva contraseña coincide con la anterior?", matchOldPassword);

    if (matchOldPassword) {
      return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });
    }

    // Agrega un log para depuración
    console.log("Nueva contraseña antes de generar el hash:", newPassword);

    const hashedPassword = createHash(newPassword);

    // Agrega un log para depuración
    console.log("Nueva contraseña después de generar el hash:", hashedPassword);

    const userUpdate = await userDao.updatePassword(user._id, hashedPassword);
    if (!userUpdate) {
      return res.status(500).json({ error: "Error al actualizar la contraseña" });
    }

    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(`Error al buscar al usuario o actualizar la contraseña: ${error}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function deleteUser(req, res) {
  const { uid } = req.params;
  try {
    await userModel.findByIdAndDelete(uid);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al eliminar el usuario" });
  }
}

async function recuperacionCorreo(req, res) {
  const { email } = req.body;

  try {
    const usuario = await userDao.getUserByEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = generateTokenRecovery({ email: usuario.email });
    if (!token) {
      return res.status(500).json({ message: 'Error al generar el token.' });
    }

    logger.info("token de recoverypass:" + token);

    const recoveryLink = `http://localhost:8080/reset_password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Hola ${usuario.nombre},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n\n${recoveryLink}\n\nSi no solicitaste un cambio de contraseña, ignora este mensaje.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al enviar el correo.' });
      }
      return res.json({ message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
}

async function changeRol(req, res) {
  const { uid } = req.params;
  try {
    const user = await userDao.getUserById(uid);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.rol === "user") {
      user.rol = "premium";
    } else if (user.rol === "premium") {
      user.rol = "user";
    }

    const updatedUser = await user.save();

    res.json({ message: "Rol de usuario actualizado", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al cambiar el rol del usuario" });
  }
}

export {
  registerUserAndMessage,
  getUserById,
  loginUser,
  getUserInfo,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
  getUserByEmail,
  recuperacionCorreo,
  updatePasswordByEmail,
  changeRol,
  userDao
};
