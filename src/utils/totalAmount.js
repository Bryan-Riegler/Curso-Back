import CartDaoMongo from "../daos/mongodb/cart.dao.js";
const cartDao = new CartDaoMongo();
import { CartModel } from "../daos/mongodb/models/cart.model.js";
import { ProductModel } from "../daos/mongodb/models/product.model.js";

export const totalAmount = async (idCart) => {
    try {
        const cart = await CartModel.findById(idCart).populate({
            path: 'products',
            populate: {
                path: 'product',
                model: ProductModel
            }
        }).exec();
        const total = cart.products.reduce((total, product) => {
            return total + product.quantity;
        }, 0);
        return total;
    } catch (error) {
        console.log(error);
    }
}