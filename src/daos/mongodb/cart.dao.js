import { CartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";

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
            const response = await CartModel.findById(id).populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: ProductModel
                }
            })
                .exec();
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

    async deleteProduct(idCart, idProduct) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const objectIdProduct = new mongoose.Types.ObjectId(idProduct);
            console.log("Cart ID:", objectIdCart);
            console.log("Product ID:", objectIdProduct);

            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                console.log("Cart not found");
                return false;
            }

            const indexToDelete = cart.products.findIndex(product => String(product.product) === String(objectIdProduct));

            if (indexToDelete !== -1) {
                cart.products.splice(indexToDelete, 1);
            } else {
                return false;
            }

            const response = await cart.save();
            return response;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateQuantity(idCart, idProduct, quantity) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const objectIdProduct = new mongoose.Types.ObjectId(idProduct);

            const cart = await CartModel.findById(objectIdCart);
            if (!cart) {
                console.log("Cart not found");
                return false;
            }

            const productIndex = cart.products.findIndex(product => String(product.product) === String(objectIdProduct));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;

                const response = await cart.save();
                return response;
            } else {
                console.log("Product not found");
                return false;
            }

        } catch (error) {
            console.log(error);
        }
    }

    async clearCart(idCart) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                console.log("Cart not found");
                return false;
            }

            cart.products = [];
            const resonse = await cart.save();
            return resonse;

        } catch (error) {
            console.log(error);
        }
    }

    async updateProducts(idCart, array) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                console.log("Cart not found");
                return false;
            }

            const productsToAdd = [];
            for (const productData of array) {
                const productId = productData.product;
                const quantity = productData.quantity;

                const existingProduct = await ProductModel.findById(productId);

                if (existingProduct) {
                    productsToAdd.push({ product: existingProduct._id, quantity });
                } else {
                    console.log(`Product with ID ${productId} not found`);
                }
            }

            cart.products = productsToAdd;
            const response = await cart.save();
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}