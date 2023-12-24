//logger.js
import winston from "winston";

// Configuración del logger para entorno de desarrollo
const devLogger = winston.createLogger({
  level: "silly", // Nivel de logs (en este caso, muestra todos los niveles)
  format: winston.format.combine(
    winston.format.colorize(), // Coloriza los logs en la consola
    winston.format.simple() // Formato simple para logs en consola
  ),
  transports: [new winston.transports.Console()], // Transporte para logs en consola
});

// Configuración del logger para entorno de producción
const prodLogger = winston.createLogger({
  level: "info", // Nivel de logs (en este caso, solo muestra logs de nivel info o superior)
  format: winston.format.json(), // Formato JSON para logs en archivos
  transports: [
    new winston.transports.File({ filename: "INFO.log" }), // Transporte para logs de nivel info en archivo INFO.log
    new winston.transports.File({ filename: "ERRORS.log", level: "error" }), // Transporte para logs de nivel error en archivo ERRORS.log
  ],
});

// Determina qué logger utilizar según el entorno
const logger = process.env.ENV === "production" ? prodLogger : devLogger;

// Loguea el entorno actual
logger.info(`Winston ENV: ${process.env.ENV}`);

export default logger;
