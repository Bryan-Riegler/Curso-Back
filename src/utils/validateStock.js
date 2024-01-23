import CartDaoMongo from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongo();
import { ProductModel } from "../daos/mongodb/models/product.model.js";

export const validateStock = async (idCart) => {
    try {
        const cart = await cartDao.getCartById(idCart);
        for (const cartItem of cart.products) {
            const product = await ProductModel.findById(cartItem.product);
            if (!product || product.stock < cartItem.quantity) {
                return false;
            } else return true;
        }


    } catch (error) {
        console.log(error);
    }
}