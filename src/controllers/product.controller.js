import * as service from "../services/product.services.js";

export const getProducts = async (req, res, next) => {
    try {
        const { page, limit, category, sort } = req.query;
        const allProducts = await service.getProducts(page, limit, category, sort);
        const next = allProducts.hasNextPage ? `http://localhost:8080/api/products?page=${allProducts.nextPage}` : null;
        const prev = allProducts.hasPrevPage ? `http://localhost:8080/api/products?page=${allProducts.prevPage}` : null;
        const status = allProducts ? "Success" : "Error";

        if (!allProducts) res.status(404).json({ message: `Products not found with ${category} category` });
        else res.status(200).json({
            status,
            payload: allProducts.docs,
            totalPages: allProducts.totalPages,
            prevPage: allProducts.prevPage,
            nextPage: allProducts.nextPage,
            page: allProducts.page,
            hasPrevPage: allProducts.hasPrevPage,
            hasNextPage: allProducts.hasNextPage,
            prev,
            next
        });

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