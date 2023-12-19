import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

import config from './config/config.js';
import businessRouter from './routes/business.router.js';
import ordersRouter from './routes/orders.router.js';
import usersRouter from './routes/users.router.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

// Configurar CORS antes de las rutas
app.use(cors({ origin: 'http://localhost:5500', methods: ['GET', 'POST', 'PUT'] }));

// Configuración de sesión
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_MONGO_URL,
    ttl: 600
  }),
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE === 'true',
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
  cookie: {
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
  },
};

app.use(session(sessionOptions));

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Conectar a MongoDB Atlas utilizando la variable de entorno MONGO_URL
mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log("Conectado a Atlas");
    console.log("Valor de SESSION_MONGO_URL:", process.env.SESSION_MONGO_URL);
  })
  .catch(error => {
    console.error("No se puede conectar con Atlas, error: " + error);
  });

// Middleware para manejar datos JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/business', businessRouter);
app.use('/api/orders', ordersRouter);

// Ruta para agregar productos al carrito
// app.use('/api/users/addToCart', addToCart); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
