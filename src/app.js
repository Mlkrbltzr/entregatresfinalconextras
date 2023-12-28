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
import vistaRouter from "./routes/views.router.js";
import userRouter from "./routes/users.router.js";
import sessionRouter from "./routes/session.router.js";
import mailRouter from "./routes/mail.router.js";
import mockingproducts from "./routes/mocking.router.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
global.io = io;
const PORT = 8080;

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
    serverSelectionTimeoutMS: 30000, // Ajusta el tiempo de espera según sea necesario
  }),
  secret: process.env.SESSION_SECRET,
  resave: process.env.SESSION_RESAVE === 'true',
  saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true',
  cookie: {
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
  },
};

// Asegúrate de configurar estas opciones antes de utilizarlas en tu aplicación
app.use(session(sessionOptions));


app.use(session(sessionOptions));

initializePassport();
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
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});