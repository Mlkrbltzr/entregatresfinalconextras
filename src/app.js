//app.js
import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';

// Importaciones relacionadas con la base de datos
import mongoose from 'mongoose';
import config from './config/config.js';

// Otras importaciones
import path from 'path';
import logger from './logger.js';
import { initializePassport } from './config/passport.config.js';  // Corrige el nombre de la importación
import * as utils from './utils.js';  // Importa todas las utilidades desde utils.js

// Rutas
import userRouter from './routes/users.router.js';
import * as productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import mailRouter from './routes/mail.router.js';
import mockingproducts from './routes/mocking.router.js';




const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de la sesión
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
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
initializaPassport();
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB Atlas
mongoose.connect(config.mongoUrl)
  .then(() => {
    logger.info('Conectado a Atlas');
  })
  .catch((error) => {
    logger.error('No se puede conectar con Atlas, error: ', error);
  });

  const __filename = new URL(import.meta.url).pathname;
  const __dirname = path.dirname(__filename);

// Middleware para manejar archivos estáticos
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Enrutadores
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/vista', viewsRouter);
app.use('/api/user', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/mail', mailRouter);
app.use('/api/mockingproducts', mockingproducts);




// Motor de vistas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));

// Definición de rutas
/*app.get('/products', async (req, res) => {
  if (!req.session.emailUsuario) {
    res.redirect('/login');
    return;
  }

  try {
    const products = await product.getProducts();
    res.render('products', {
      title: 'Productos',
      products,
      email: req.session.emailUsuario,
      rol: req.session.rolUsuario,
    });
  } catch (error) {
    logger.error('Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const products = await product.getProductById(productId);
    res.render('details', { products });
  } catch (error) {
    logger.error('Error al obtener el producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/carts', async (req, res) => {
  try {
    const cart = await carts.readCarts();
    const productsInCart = await carts.getProductsForCart(cart.products);
    logger.info('Datos del carrito:', cart);
    res.render('carts', { cart, productsInCart });
  } catch (error) {
    logger.error('Error al obtener el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/login', (req, res) => {
  res.render('./login', { title: 'Iniciar Sesión' });
});

app.get('/faillogin', (req, res) => {
  res.send('Autenticación fallida. Por favor, verifica tus credenciales.');
});

app.get('/formRegister', (req, res) => {
  res.render('formRegister', { title: 'Registro' });
});

app.get('/failformRegister', (req, res) => {
  res.status(400).send('Error en el registro. El usuario ya está registrado.');
});

app.get('/userProfile', async (req, res) => {
  if (!req.session.emailUsuario) {
    return res.redirect('/login');
  }

  res.render('userProfile', {
    title: 'Vista Perfil Usuario',
    first_name: req.session.nomUsuario,
    last_name: req.session.apeUsuario,
    email: req.session.emailUsuario,
    rol: req.session.rolUsuario,
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: 'Cerrar sesión Error', body: error });
    }
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});
*/