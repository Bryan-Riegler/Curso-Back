import { Router } from "express";
const router = Router();
import { ProductManager } from "../manager/productManager.js";
import { productValidator } from "../middlewares/productValidator.js";
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const allProducts = await productManager.getProducts();
        const productsLimit = allProducts.slice(0, limit);
        if (!limit) {
            res.status(200).json(allProducts);
        } else {
            res.status(200).json(productsLimit);
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(Number(id));
        if (!product) res.status(404).json({ message: "Product not found" });
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.post("/", productValidator, async (req, res) => {
    try {
        const productCreated = await productManager.addProduct(req.body);
        res.status(200).json(productCreated);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const product = { ...req.body };
        const { id } = req.params;
        const idN = Number(id);
        const productToUpt = await productManager.getProductById(idN);
        if (!productToUpt) res.status(404).json({ message: 'Product not found' });
        else await productManager.updateProduct(product, idN);
        res.status(200).json({ message: `The product with id ${id} was updated` });
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idN = Number(id);
        await productManager.deleteProduct(idN);
        res.json({ message: `Product with id ${id} was deleted` });
    } catch (error) {
        res.status(500).json(error.message);
    }
})

export default router;