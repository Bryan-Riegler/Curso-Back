import CartDaoMongo from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongo();

// import { CartManager } from "../daos/fs/cartManager.js";
// import { __dirname } from "../dirname.js";
// const cartDao = new CartManager(__dirname + "/data/carts.json");

export const getCarts = async () => {
    try {
        return await cartDao.getCarts();
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getCartById = async (id) => {
    try {
        const cart = await cartDao.getCartById(id);
        if (!cart) return false;
        else return cart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const createCart = async () => {
    try {
        const newCart = await cartDao.createCart();
        if (!newCart) return false;
        else return newCart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addProductToCart = async (idCart, idProduct) => {
    try {
        const addToCart = await cartDao.addProductToCart(idCart, idProduct);
        if (!addToCart) return false;
        else return addToCart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const deleteProduct = async (idCart, idProduct) => {
    try {
        const deleteProduct = await cartDao.deleteProduct(idCart, idProduct);
        if (!deleteProduct) return false;
        else return deleteProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateQuantity = async (idCart, idProduct, quantity) => {
    try {
        const updateQuantity = await cartDao.updateQuantity(idCart, idProduct, quantity);
        if (!updateQuantity) return false;
        else return updateQuantity;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const clearCart = async (idCart) => {
    try {
        const clearCart = await cartDao.clearCart(idCart);
        if (!clearCart) return false;
        else return clearCart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateProducts = async (idCart, array) => {
    try {
        const updateProducts = await cartDao.updateProducts(idCart, array);
        if (!updateProducts) return false;
        else return updateProducts;
    } catch (error) {
        throw new Error(error.message)
    }
}