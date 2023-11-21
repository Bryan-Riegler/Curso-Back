import { Schema, model } from "mongoose";

export const cartsCollection = "carts";

export const cartSchema = new Schema({
    products: [
        {
            product: { type: "string", required: true },
            quantity: { type: "number", required: true }
        }
    ]
});

export const CartModel = model(cartsCollection, cartSchema);