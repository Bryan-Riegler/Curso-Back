import { Router } from "express";
const router = new Router();
import * as controller from "../controllers/user.controller.js";
import passport from "passport";

router.get("/logout", controller.logout);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/profile", controller.getProfile);

router.get("/register-github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), controller.gitHubResponse);

export default router;