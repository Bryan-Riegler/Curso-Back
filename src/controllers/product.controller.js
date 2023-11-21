import * as service from "../services/product.services.js";

export const getProducts = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const allProducts = await service.getProducts();
        const productsLimit = allProducts.slice(0, limit);
        if (!limit) {
            res.status(200).json(allProducts);
        } else {
            res.status(200).json(productsLimit);
        }
    } catch (error) {
        next(error.message);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await service.getProductById(id)
        if (!product) res.status(404).json({ message: 'Product not found' });
        else res.status(200).json(product);
    } catch (error) {
        next(error.message);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const newProduct = await service.addProduct(req.body);
        if (!newProduct) res.status(404).json({ message: 'Error creating product' });
        else res.status(200).json(newProduct);
    } catch (error) {
        next(error.message);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productUpdated = await service.updateProduct(id, req.body);
        if (!productUpdated) res.status(404).json({ message: 'Error updating product' });
        else res.status(200).json(productUpdated);
    } catch (error) {
        next(error.message);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productDeleted = await service.deleteProduct(id);
        if (!productDeleted) res.status(404).json({ message: 'Error deleting product' });
        else res.status(200).json({ message: `Product with id: ${id} deleted` });
    } catch (error) {
        next(error.message);
    }
};