import express from "express";
import path from "path";
import { createServer } from 'http';
import { Server } from "socket.io";
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cartRouter from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import vistaRouter from "./routes/vista.router.js";
import userRouter from "./routes/users.router.js";
import sessionRouter from "./routes/session.router.js";
import mailRouter from "./routes/mail.router.js";
import mockingproducts from "./routes/mocking.router.js";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Manejar eventos de conexión y error en Mongoose
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

db.once('connected', () => {
  console.log('Conectado a MongoDB');
});

db.once('disconnected', () => {
  console.log('Desconectado de MongoDB');
});

// Definición de modelos aquí...

const app = express();
const server = createServer(app);
const io = new Server(server);
global.io = io;

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket.IO');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 600,
    serverSelectionTimeoutMS: 30000,
  }),
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE === 'true',
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
  cookie: {
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
  },
};

app.use(session(sessionOptions));

initializePassport();
// Manejar eventos de sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", cartRouter);
app.use("/", productsRouter);
app.use("/", vistaRouter);
app.use("/", userRouter);
app.use("/", sessionRouter);
app.use("/", mailRouter);
app.use("/", mockingproducts);

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");
//Usa la carpeta views como carpeta de vistas
app.set("views", path.join(process.cwd(), "views"));//Archivos dentro de la carpeta public

app.use(express.static(new URL("public", import.meta.url).pathname));

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
