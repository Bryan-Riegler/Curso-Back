import { Router } from "express";
const router = Router();
// import { ProductManager } from "../daos/fs/productManager.js";
// const productManager = new ProductManager("./src/data/products.json");
import * as controller from "../controllers/product.controller.js"
import * as userController from "../controllers/user.controller.js"

router.get("/home", controller.getProductsRender)

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
});

router.get("/chat", (req, res) => {
    res.render("chat")
})

router.get("/", (req, res) => {
    res.render("login")
})

router.get("/postman", userController.login) // login desde postman

router.get("/register", (req, res) => {
    res.render("register")
})
router.get("/registerError", (req, res) => {
    res.render("registerError");
});
router.get("/loginError", (req, res) => {
    res.render("loginError");
});





export default router;