/*import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
};*/
//config.js
import { config } from 'dotenv';
config();

const { PERSISTENCE } = process.env;

if (!PERSISTENCE) {
  console.error("La variable de entorno PERSISTENCE no está configurada.");
  process.exit(1);
}

export default {
  persistence: process.env.PERSISTENCE,
};