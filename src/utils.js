import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => {
  const hashedPassword = createHash(password);
  return bcrypt.compareSync(hashedPassword, user.password);
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
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  generateTokenRecovery,
  PRIVATE_KEY,
};