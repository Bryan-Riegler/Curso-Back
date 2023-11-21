import { Router } from "express";
import * as controller from "../controllers/cart.controller.js";

const router = Router();

router.post("/", controller.createCart);

router.get("/:id", controller.getCartById);

router.post("/:idCart/product/:idProduct", controller.addProductToCart);

export default router;