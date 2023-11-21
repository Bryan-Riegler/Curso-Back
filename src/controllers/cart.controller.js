import * as service from "../services/cart.services.js"
import { getProductById } from "../services/product.services.js";

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
        if (!cart) res.status(404).json({ message: 'Cart not found' });
        else res.status(200).json(cart);
    } catch (error) {
        next(error.message);
    }
};

export const createCart = async (req, res, next) => {
    try {
        const newCart = await service.createCart();
        if (!newCart) res.status(404).json({ message: 'error creating cart' });
        else res.status(200).json(newCart);
    } catch (error) {
        next(error.message);
    }
}

export const addProductToCart = async (req, res, next) => {
    try {
        const { idCart } = req.params;
        const { idProduct } = req.params;
        const productExist = await getProductById(idProduct);

        if (!productExist) {
            res.status(404).json({ message: 'Product not found' })
        } else {
            const addToCart = await service.addProductToCart(idCart, idProduct);
            if (!addToCart) res.status(404).json({ message: 'error add product' });
            else res.status(200).json({ message: `product with id:${idProduct} added to cart ${idCart}` });

        }
    } catch (error) {
        next(error.message);
    }
}