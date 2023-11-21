import { CartModel } from "./models/cart.model.js";
import mongoose from "mongoose";

export default class CartDaoMongo {
    async getCarts() {
        try {
            const response = await CartModel.findOne({});
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const response = await CartModel.findById(id);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async createCart() {
        try {
            const cart = {
                products: [],
            }
            const response = await CartModel.create(cart);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(idCart, idProduct) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const objectIdProduct = new mongoose.Types.ObjectId(idProduct);

            const existCart = await CartModel.findById(objectIdCart);
            if (existCart) {
                const existingProductIndex = existCart.products.findIndex(product => String(product.product) === String(objectIdProduct));
                if (existingProductIndex !== -1) {
                    existCart.products[existingProductIndex].quantity += 1;
                } else {
                    const product = {
                        product: objectIdProduct,
                        quantity: 1
                    };
                    existCart.products.push(product);
                }
                const response = await existCart.save();
                return response;
            }
        } catch (error) {
            console.log(error);
        }

    }
}