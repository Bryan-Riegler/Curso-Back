import * as service from "../services/cart.services.js"
import { getProductById } from "../services/product.services.js";
import { errorsDictionary } from "../utils/errorsDictionary.js";

export const getCarts = async (req, res, next) => {
    try {
        const carts = await service.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        next(error.message);
    }
};

export const getCartById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await service.getCartById(id);
        if (!cart) res.status(404).json({ message: errorsDictionary.ERROR_FIND_ });
        else res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const createCart = async (req, res, next) => {
    try {
        const newCart = await service.createCart();
        if (!newCart) res.status(404).json({ message: errorsDictionary.ERROR_CREATE });
        else res.status(200).json(newCart);
    } catch (error) {
        next(error);
    }
}

export const addProductToCart = async (req, res, next) => {
    try {
        const { idCart } = req.params;
        const { idProduct } = req.params;
        const productExist = await getProductById(idProduct);

        if (!productExist) {
            res.status(404).json({ message: errorsDictionary.ERROR_FIND_ })
        } else {
            const addToCart = await service.addProductToCart(idCart, idProduct);
            if (!addToCart) res.status(404).json({ message: 'error add product' });
            else res.status(200).json({ message: `product with id:${idProduct} added to cart ${idCart}` });

        }
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const { idCart, idProduct } = req.params;

        const deleteProd = await service.deleteProduct(idCart, idProduct);
        if (!deleteProd) {
            return res.status(404).json({ message: errorsDictionary.ERROR_DELETE });
        } else return res.status(200).json({ message: `Product with id ${idProduct} deleted from cart ${idCart}` });

    } catch (error) {
        next(error);
    }
}

export const updateQuantity = async (req, res, next) => {
    try {
        const { idCart, idProduct } = req.params;
        const { quantity } = req.body;

        const updateQuantity = await service.updateQuantity(idCart, idProduct, quantity);
        if (!updateQuantity) {
            return res.status(404).json({ message: errorsDictionary.ERROR_UPDATE });
        } else return res.status(200).json({ message: "Quantity changed successfully" })
    } catch (error) {
        next(error);
    }
}

export const clearCart = async (req, res, next) => {
    try {
        const { idCart } = req.params;
        const clearCart = await service.clearCart(idCart);

        if (!clearCart) {
            return res.status(404).json({ message: errorsDictionary.ERROR_DELETE });
        } else return res.status(200).json(clearCart);
    } catch (error) {
        next(error);
    }
}

export const updateProducts = async (req, res, next) => {
    try {
        const { idCart } = req.params;
        const array = req.body;
        const updateProducts = await service.updateProducts(idCart, array);

        if (!updateProducts) {
            return res.status(404).json({ message: errorsDictionary.ERROR_UPDATE });
        } else return res.status(200).json(updateProducts);
    } catch (error) {
        next(error);
    }
}