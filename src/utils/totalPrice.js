import { ProductModel } from "../daos/mongodb/models/product.model.js";
import { CartModel } from "../daos/mongodb/models/cart.model.js";
import { logger } from "./logger.js"

export const totalPrice = async (idCart) => {
    try {
        const cart = await CartModel.findById(idCart).populate({
            path: 'products',
            populate: {
                path: 'product',
                model: ProductModel
            }
        }).exec();
        const totalPrice = cart.products.reduce((total, cartItem) => {
            const productPrice = cartItem.product.price;
            const quantity = cartItem.quantity;
            return total + productPrice * quantity;
        }, 0);
        return totalPrice
    } catch (error) {
        logger.error(error);
    }
}