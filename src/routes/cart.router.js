import { Router } from "express";
const router = Router();
import { CartManager } from "../manager/cartManager.js";
const cartManager = new CartManager("./src/data/carts.json");
import { ProductManager } from "../manager/productManager.js";
const productManager = new ProductManager("./src/data/products.json");

router.post("/", async (req, res) => {
    try {
        const cartCreated = await cartManager.createCart();
        res.status(200).send(cartCreated);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartManager.getCartById(Number(id));
        if (!cart) res.status(404).json({ message: "Cart not found" });
        else res.status(200).json(cart);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/:idCart/product/:idProduct", async (req, res) => {
    try {
        const { idCart } = req.params;
        const { idProduct } = req.params;
        const idProdNum = Number(idProduct);
        const idCartNum = Number(idCart);
        const cartExist = await cartManager.getCartById(idCartNum);
        const productExist = await productManager.getProductById(idProdNum);

        if (!productExist) {
            res.status(404).json({ message: "Product not found" })
        } else {
            if (!cartExist) {
                res.status(404).json({ message: "Cart not found" });
            } else {
                await cartManager.addProductToCart(idCartNum, idProdNum);
                res.status(200).json({ message: `Product with id ${idProduct} added to cart ${idCartNum}` });
            }
        }

    } catch (error) {
        res.status(500).json(error.message);
    }


})

export default router;