import { Schema, model } from "mongoose";

export const cartsCollection = "carts";

export const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" }
        }
    ]
});

export const CartModel = model(cartsCollection, cartSchema);