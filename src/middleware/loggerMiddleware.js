//loggerMiddleware.js
import winston from 'winston';
import logger from './logger.js';

// Middleware que añade el logger a la solicitud y pasa al siguiente middleware
const loggerMiddleware = (req, res, next) => {
  // Añade el logger a la solicitud
  req.logger = logger;
  // Continúa con el siguiente middleware
  next();
};

// Exporta el middleware como módulo predeterminado
export default loggerMiddleware;
