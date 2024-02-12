import { Router } from "express";
import * as controller from "../controllers/cart.controller.js";
import { checkUserRole } from "../middlewares/checkUserRole.js";
import { Ticket } from "../controllers/ticket.controller.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = Router();

router.post("/", controller.createCart);

router.get("/:id", controller.getCartById);

router.post("/:idCart/product/:idProduct", checkUserRole, checkAuth, controller.addProductToCart);

router.delete("/:idCart/product/:idProduct", controller.deleteProduct);

router.put("/:idCart/product/:idProduct", controller.updateQuantity);

router.delete("/:idCart", controller.clearCart);

router.put("/:idCart", controller.updateProducts);

router.post("/:cartId/purchase", Ticket);

export default router;