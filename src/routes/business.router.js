import { Router } from "express";
import { getBusiness, getBusinessById, createBusiness, addProduct } from "../controllers/business.controller.js";
import { adminValidator } from "../middlewares/auth.middleware.js"; // Importa el middleware de autorización

const router = Router();

router.get("/", getBusiness);
router.post("/", adminValidator, createBusiness); // Aplica el middleware para la creación de negocios
router.get("/:bid", getBusinessById);
router.post("/:bid/product", adminValidator, addProduct); // Aplica el middleware para la adición de productos

export default router;