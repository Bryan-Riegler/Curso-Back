import { Router } from "express";
import * as controller from "../controllers/cart.controller.js";
import { checkUserRole } from "../middlewares/checkUserRole.js";

const router = Router();

router.post("/", controller.createCart);

router.get("/:id", controller.getCartById);

router.post("/:idCart/product/:idProduct", checkUserRole, controller.addProductToCart);

router.delete("/:idCart/product/:idProduct", controller.deleteProduct);

router.put("/:idCart/product/:idProduct", controller.updateQuantity);

router.delete("/:idCart", controller.clearCart);

router.put("/:idCart", controller.updateProducts);

export default router;