import { Router } from "express";
import * as controller from "../controllers/productsFake.contoller.js";

const router = Router();

router.get("/", controller.getFakeProducts);

router.post("/mockingproducts", controller.createFakeProducts);

export default router;