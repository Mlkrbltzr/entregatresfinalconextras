//carts.router.js
import express from "express";
import passport from "passport";
import { initializePassport, checkRole } from "../config/passport.config.js";
import cartsControllers from "../controllers/cart.controller.js";

const router = express.Router();

// Inicializar la configuración de Passport
initializePassport(passport);

// Obtener un carrito por ID
// router.get("/api/carts/:cid", cartsControllers.getCartById);

// Obtener todos los carritos
router.get("/api/carts", cartsControllers.getAllCarts);

// Crear un carrito
router.post("/api/carts", cartsControllers.createCart);

// Agregar varios productos al carrito
router.post(
  "/api/carts/:cid/products",
  passport.authenticate("current", { session: false }),
  checkRole(["user", "premium"]),
  cartsControllers.addProductsToCart
);

// Actualizar la cantidad de un producto en el carrito
router.put("/api/carts/:cid/products/:pid", cartsControllers.updateProductQuantity);

// Borrar un carrito específico
router.delete("/api/deletecarts/:id", cartsControllers.deleteCartById);

// Borrar todos los productos de un carrito
router.delete("/api/deleteproductcarts/:cid", cartsControllers.deleteAllProductsInCart);

// Borrar un producto específico de un carrito específico
router.delete("/api/carts/:cid/product/:pid", cartsControllers.deleteProductFromCart);

// Realizar la compra total de los productos del carrito
router.get(
  "/api/carts/:cid/purchase",
  passport.authenticate("current", { session: false }),
  checkRole("user"),
  cartsControllers.purchaseProducts
);

// Obtener el carrito del usuario
router.get(
  "/api/carts/getusercart",
  passport.authenticate("current", { session: false }),
  cartsControllers.getUserCart
);

export default router;
