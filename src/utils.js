// utils.js

// Importaciones necesarias
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';  // Importa uuid
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { faker } from '@faker-js/faker';
import logger from './controllers/logger.controller.js';

// Función para crear un hash de contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para validar una contraseña
export const isValidPassword = (user, password) => {
    logger.info('Ejecutando isValidPassword');
    return bcrypt.compareSync(password, user.password || ''); // Agregamos el manejo para contraseña nula
};

// Clave privada para JWT
const PRIVATE_KEY = "coderJsonWebToken";

// Función para generar un token JWT
export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
    return token;
};

// Middleware para la autenticación basada en token JWT
export const authToken = (req, res, next) => {
    const autHeader = req.headers.authorization;
    if (!autHeader) return res.status(401).send({
        error: "No autorizado"
    });

    const token = autHeader.split(" ")[1];

    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if (error) return res.status(403).send({ error: "No autorizado" });
        req.user = credential.user;
        next();
    });
};

// Función para enviar solo la información necesaria del usuario
export const sendUserInfo = (req, res, next) => {
  const { name, email, role } = req.user;
  res.locals.userInfo = { name, email, role };
  next();
};

// Función para generar un código único
export const generateUniqueCode = () => {
    return uuidv4();
};

// Variables para la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para generar un usuario falso (puedes comentar esto si no lo necesitas)
export const generateUser = () => {
    let products = [];

    for (let i = 0; i < 10; i++) {
        products.push(generateProduct());
    }
    logger.debug(products);

    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        email: faker.internet.email(),
        job: faker.person.jobTitle()
    };
};

// Función para generar un producto falso (puedes comentar esto si no lo necesitas)
export const generateProduct = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription()
    };
};

// Exporta la ruta del directorio actual
export default __dirname;
