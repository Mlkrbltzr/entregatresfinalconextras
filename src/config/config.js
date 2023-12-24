/*import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
};*/
//config.js
import dotenv from 'dotenv';

// Configura las variables de entorno a partir del archivo .env
dotenv.config();

// Exporta un objeto con una propiedad llamada "persistence" que obtiene su valor de la variable de entorno "PERSISTENCE"
export default {
    persistence: process.env.PERSISTENCE
};
