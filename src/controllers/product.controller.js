import * as service from "../services/product.services.js";
import { errorsDictionary } from "../utils/errorsDictionary.js";
import { ProductModel } from "../daos/mongodb/models/product.model.js";

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
        throw new Error(error.message)
    }
};

export const getProductsRender = async (req, res) => {
    try {
        const { page, limit, category, sort } = req.query;
        const allProducts = await service.getProducts(page, limit, category, sort);
        const next = allProducts.hasNextPage ? `http://localhost:8080/api/products?page=${allProducts.nextPage}` : null;
        const prev = allProducts.hasPrevPage ? `http://localhost:8080/api/products?page=${allProducts.prevPage}` : null;
        const status = allProducts ? "Success" : "Error";

        if (!allProducts) res.status(404).json({ message: `Products not found with ${category} category` });
        else {
            const welcomeMessage = req.session.firstName ? `Welcome, ${req.session.firstName}!` : 'Welcome!';


            const responseJSON = {
                status,
                welcomeMessage,
                payload: allProducts.docs,
                totalPages: allProducts.totalPages,
                prevPage: allProducts.prevPage,
                nextPage: allProducts.nextPage,
                page: allProducts.page,
                hasPrevPage: allProducts.hasPrevPage,
                hasNextPage: allProducts.hasNextPage,
                prev,
                next
            };

            res.status(200).json(responseJSON);
        }

    } catch (error) {
        throw new Error(error.message)
    }
};


export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await service.getProductById(id)
        if (!product) res.status(404).json({ message: errorsDictionary.ERROR_FIND_ });
        else res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== "premium" && userRole !== "admin") {
            return res.status(403).json({ msg: "Unauthorized to create products" });
        }

        const owner = (userRole === "premium") ? req.user.email : "admin";

        const newProduct = await service.addProduct({ ...req.body, owner });
        if (!newProduct) res.status(404).json({ msg: errorsDictionary.ERROR_CREATE })
        else res.status(200).json(newProduct)
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productUpdated = await service.updateProduct(id, req.body);
        if (!productUpdated) res.status(404).json({ message: errorsDictionary.ERROR_UPDATE });
        else res.status(200).json(productUpdated);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;

        const product = await service.getProductById(id)

        if (!product) {
            res.status(404).json({ msg: errorsDictionary.ERROR_FIND_ })
        } else {
            if (userRole === "admin") {
                await service.deleteProduct(id);
                res.status(200).json({ msg: `Product with id ${id} was deleted successfully` });
            } else if (userRole === "premium") {
                const product = await ProductModel.findOne({ _id: id, owner: req.user.email });
                if (product) {
                    await service.deleteProduct(id);
                    res.status(200).json({ msg: `Product with id ${id} was deleted successfully` })
                } else {
                    res.status(403).json({ msg: "You are not the owner of this product" });
                }
            } else {
                res.status(403).json({ msg: "Unaothorized to delete products" })
            }

        }


    } catch (error) {
        next(error);
    }
};