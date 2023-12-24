//factory.js
import mongoose from "mongoose";
import config from "../config/config.js";
import dotenv from "dotenv";

dotenv.config();

// Variables para almacenar los modelos
let Users;
let Carts;
let Products;

switch (config.persistence) {
  case "MONGO":
    console.log("Using MongoDB");
    // Conexión a MongoDB
    mongoose.connect(process.env.MONGOURL)
      .then(() => {
        // Importación de modelos MongoDB
        Users = require("./mongo/users.mongo.js").default;
        Carts = require("./mongo/carts.mongo.js").default;
        Products = require("./mongo/products.mongo.js").default;
        console.log("Connected to MongoDB");
      })
      .catch(error => {
        console.error("Error connecting to MongoDB:", error);
      });
    break;
  case "MEMORY":
    console.log("Using Memory");
    // Importación de modelos de memoria
    Users = require("../dao/memory/user.memory.js").default;
    Carts = require("../dao/memory/cart.memory.js").default;
    Products = require("../dao/memory/product.memory.js").default;
    break;
}

// Exportación de modelos según la configuración
export { Users, Carts, Products };
