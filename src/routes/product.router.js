import { Router } from "express";
import { productValidator } from "../middlewares/productValidator.js";
import * as controller from "../controllers/product.controller.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";
import { checkAuth } from "../middlewares/checkAuth.js"

const router = Router();

router.get("/", controller.getProducts);

router.get("/:id", controller.getProductById);

router.post("/", productValidator, checkAuth, controller.addProduct);

router.put("/:id", checkAdminRole, controller.updateProduct);

router.delete("/:id", checkAuth, controller.deleteProduct);

export default router;