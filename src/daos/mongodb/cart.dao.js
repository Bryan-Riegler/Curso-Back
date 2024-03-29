import { CartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import { ProductModel } from "./models/product.model.js";
import { logger } from "../../utils/logger.js"

export default class CartDaoMongo {
    async getCarts() {
        try {
            const response = await CartModel.findOne({});
            return response
        } catch (error) {
            throw new Error(error.message)
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
            throw new Error(error.message)
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
            throw new Error(error.message)
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
            throw new Error(error.message)
        }

    }

    async deleteProduct(idCart, idProduct) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const objectIdProduct = new mongoose.Types.ObjectId(idProduct);
            logger.info("Cart ID:", objectIdCart);
            logger.info("Product ID:", objectIdProduct);

            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                logger.error("Cart not found");
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
            throw new Error(error.message)
        }
    }

    async updateQuantity(idCart, idProduct, quantity) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const objectIdProduct = new mongoose.Types.ObjectId(idProduct);

            const cart = await CartModel.findById(objectIdCart);
            if (!cart) {
                logger.error("Cart not found");
                return false;
            }

            const productIndex = cart.products.findIndex(product => String(product.product) === String(objectIdProduct));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;

                const response = await cart.save();
                return response;
            } else {
                logger.error("Product not found");
                return false;
            }

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async clearCart(idCart) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                logger.error("Cart not found");
                return false;
            }

            cart.products = [];
            const resonse = await cart.save();
            return resonse;

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProducts(idCart, array) {
        try {
            const objectIdCart = new mongoose.Types.ObjectId(idCart);
            const cart = await CartModel.findById(objectIdCart);

            if (!cart) {
                logger.error("Cart not found");
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
                    logger.error(`Product with ID ${productId} not found`);
                }
            }

            cart.products = productsToAdd;
            const response = await cart.save();
            return response;

        } catch (error) {
            throw new Error(error.message)
        }
    }
}