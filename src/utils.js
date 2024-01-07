// utils.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const createHash = (password) => bcrypt.hashSync(password, 10);
// Modificamos createHash para eliminar el uso de genSaltSync
const isValidPassword = (user, password) => {
  try {
    if (!user) {
      console.log("Usuario no encontrado al validar la contraseña");
      return false;
    }

    console.log("Contraseña proporcionada en la solicitud:", password);
    console.log("Contraseña almacenada en la base de datos:", user.password);
    console.log("Longitud de la contraseña proporcionada:", password.length);
    console.log("Longitud de la contraseña almacenada:", user.password.length);

   // const isPasswordValid = bcrypt.compareSync(password, user.password);
   const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

    console.log("Contraseña proporcionada después de comparar:", password);
    console.log("Contraseña almacenada después de comparar:", user.password);
    console.log("¿La contraseña es válida?", isValidPassword);

    return isValidPassword;
  } catch (error) {
    console.error("Error al comparar contraseñas:", error);
    return false;
  }
};

const PRIVATE_KEY = process.env.PRIVATE_KEY || "defaultFallbackValue";

function generateToken(user) {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
}

const generateTokenRecovery = (data) => {
  try {
    const token = jwt.sign(data, PRIVATE_KEY, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error al generar el token de recuperación:', error);
    return null;
  }
};

const authToken = (req, res, next) => {
  const autHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;
  const urlToken = req.params.token;

  const token = autHeader ? autHeader.split(" ")[1] : cookieToken || urlToken;

  if (!token) {
    return res.status(401).send({
      error: "No autenticado"
    });
  }

  jwt.verify(token, PRIVATE_KEY, (error, credential) => {
    if (error) {
      console.error('Error al verificar el token:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ error: "El token ha expirado" });
      }
      return res.status(403).send({ error: "No autorizado" });
    }
    req.user = credential.user;
    next();
  });
};

export {
  isValidPassword,
  createHash,
  generateToken,
  authToken,
  generateTokenRecovery,
  PRIVATE_KEY,
};
