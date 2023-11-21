import { Schema, model } from "mongoose";

export const productsCollection = "products";

export const productsSchema = new Schema({
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    price: { type: "number", required: true },
    code: { type: "string", required: true },
    stock: { type: "number", required: true },
    category: { type: "string", required: true },
    status: { type: "boolean" }
});

export const ProductModel = model(productsCollection, productsSchema);