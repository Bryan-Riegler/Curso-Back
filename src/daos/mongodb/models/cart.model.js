import config from "../../../config/config.js";
import { Schema, model } from "mongoose";


export const cartsCollection = config.TEST_COLLECTION === "test" ? "TestCarts" : "carts";

export const cartSchema = new Schema({
    products: [
        {
            _id: false,
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 0 }
        }
    ]
});

export const CartModel = model(cartsCollection, cartSchema);