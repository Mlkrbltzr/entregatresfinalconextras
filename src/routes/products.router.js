//products.router.js
import express from "express";
import passport from "passport";
import { initializePassport, checkRole, passportConfig } from "../config/passport.config.js";  // Importa passportConfig también
import * as ProductController from "../controllers/products.controller.js";

const router = express.Router();

// Obtener todos los productos
router.get("/products", ProductController.getProducts);

// Obtener producto por ID
router.get("/product/:pid", ProductController.getProductById);

// Crear un producto
// Actualiza el uso de checkRole en las rutas
router.post(
  "/api/products",
  passport.authenticate("current", { session: false }),
  passportConfig.checkRole(["admin", "premium"]),
  ProductController.saveProduct
);

router.put(
  "/products/:id",
  passport.authenticate("current", { session: false }),
  passportConfig.checkRole("admin"),
  ProductController.updateProduct
);

router.delete(
  "/products/:id",
  passport.authenticate("current", { session: false }),
  passportConfig.checkRole(["admin", "premium"]),
  ProductController.deleteProduct
);


export { initializePassport, checkRole };
