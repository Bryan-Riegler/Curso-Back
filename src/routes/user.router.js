import { Router } from "express";
const router = new Router();
import * as controller from "../controllers/user.controller.js";
import passport from "passport";
import { tokenValidator } from "../middlewares/tokenValidator.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";

router.get("/logout", controller.logout);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/profile", controller.getProfile);

router.get("/register-github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), controller.gitHubResponse);

router.post("/loginJwt", controller.loginJwt);

router.post("/registerJwt", controller.registerJwt);

router.get("/private", tokenValidator, controller.getPrivate);

router.post("/resetPassword", checkAuth, controller.resetPassword);

router.put("/updatePassword", checkAuth, controller.updatePassword);

router.put("/premium/:id", checkAuth, controller.changeRole)

router.delete("/deleteUsers", checkAdminRole, controller.deleteUsers);

router.get("/getUsers", checkAdminRole, controller.getAllUsers)

export default router;