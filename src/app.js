// Importa las bibliotecas y módulos necesarios de Node.js
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import mongoose from 'mongoose';
import path from 'path';

// Importa configuraciones y variables de entorno
import config from './config/config.js';

// Importa utilidades propias y funciones auxiliares
import logger from './logger.js';
import * as utils from './utils.js';

// Importa la definición del modelo de base de datos y configuración de conexión
import { productsRouter } from './routes/products.router.js';
import { initializePassport } from './config/passport.config.js';

// Importa enrutadores y controladores
import userRouter from './routes/users.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import mailRouter from './routes/mail.router.js';
import mockingproducts from './routes/mocking.router.js';

// Crea una instancia de la aplicación
const app = express();

// Configuración del manejo de datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de la sesión
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_MONGO_URL,
    ttl: 600,
  }),
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE === 'true',
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
  cookie: {
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
  },
};

app.use(session(sessionOptions));

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    logger.info('Conectado a Atlas');
  })
  .catch((error) => {
    logger.error('No se puede conectar con Atlas, error: ', error);
  });

// Ruta para archivos estáticos
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Enrutadores
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/vista', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/mail', mailRouter);
app.use('/api/mockingproducts', mockingproducts);

// Resto de la configuración y escucha del servidor
// ...

// Motor de vistas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));

// Configuración del puerto y escucha del servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});
