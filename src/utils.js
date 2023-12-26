// utils.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* 
  La función createHash toma una contraseña y aplica un proceso de "hashing" utilizando un "salt".
  El valor del "salt" se genera con genSaltSync(10) para mayor seguridad.
  Retorna la contraseña hasheada. Este proceso es irreversible.
*/
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/* 
  La función isValidPassword compara una contraseña sin hashear con una contraseña hasheada en la base de datos.
  Retorna true si coinciden, false en caso contrario.
*/
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const PRIVATE_KEY = process.env.PRIVATE_KEY || "defaultFallbackValue"; // esta tambien en .env

/* 
  La función generateToken crea un token JWT utilizando la librería 'jsonwebtoken'.
  El token contiene la información del usuario y expira en 24 horas.
*/
function generateToken(user) {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
}

/* 
  La función generateTokenRecovery crea un token JWT para procesos de recuperación.
  El token expira en 1 hora.
*/
const generateTokenRecovery = (data) => {
  try {
    const token = jwt.sign(data, PRIVATE_KEY, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error al generar el token de recuperación:', error);
    return null;
  }
};

/* 
  La función authToken verifica la autenticación del usuario utilizando un token JWT.
  El token puede estar en los encabezados, en las cookies o en la URL.
*/
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
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  generateTokenRecovery,
  PRIVATE_KEY,
};
