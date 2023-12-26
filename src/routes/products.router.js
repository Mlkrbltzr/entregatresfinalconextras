// products.router.js

import express from "express";
import passport from "passport";
import { initializePassport, checkRole } from "../config/passport.config.js";  // Importa las funciones directamente
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
  passport.authenticate("current", { session: false }),  // Autentica utilizando la estrategia "current"
  checkRole(["admin", "premium"]),  // Verifica el rol del usuario utilizando checkRole
  ProductController.saveProduct
);

// Actualizar un producto
router.put(
  "/products/:id",
  passport.authenticate("current", { session: false }),  // Autentica utilizando la estrategia "current"
  checkRole("admin"),  // Verifica que el rol del usuario sea "admin" utilizando checkRole
  ProductController.updateProduct
);

// Eliminar un producto
router.delete(
  "/products/:id",
  passport.authenticate("current", { session: false }),  // Autentica utilizando la estrategia "current"
  checkRole(["admin", "premium"]),  // Verifica el rol del usuario utilizando checkRole
  ProductController.deleteProduct
);

export { router as productsRouter };