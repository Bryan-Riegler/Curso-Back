import { Router } from "express";
const router = Router();
import { ProductManager } from "../manager/productManager.js";
const productManager = new ProductManager("./src/data/products.json");

router.get("/home", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).render("home", { products });

    } catch (error) {
        res.status(500).console.log(error);
    }
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
});

export default router;