import express from "express";
import { ProductManager } from "./manager/productManager.js";
const productManager = new ProductManager();

const app = express();

app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query;
        const allProducts = await productManager.getProducts();
        const productsLimit = allProducts.slice(0, limit);
        if (limit === undefined) {
            res.status(200).json(allProducts);
        } else {
            res.status(200).json(productsLimit);
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
})

app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(Number(id));
        if (!product) res.status(404).json(`product with id ${id} not found`);
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
})


const port = 8080

app.listen(port, () => console.log(`localhost:${port}`));