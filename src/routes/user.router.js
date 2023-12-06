import { Router } from "express";
const router = new Router();
import * as controller from "../controllers/user.controller.js";

router.get("/logout", controller.logout);
router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/profile", controller.getProfile);

export default router;