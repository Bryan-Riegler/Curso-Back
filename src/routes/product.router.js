import { Router } from "express";
import { productValidator } from "../middlewares/productValidator.js";
import * as controller from "../controllers/product.controller.js";

const router = Router();

router.get("/", controller.getProducts);

router.get("/:id", controller.getProductById);

router.post("/", controller.addProduct, productValidator);

router.put("/:id", controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

export default router;