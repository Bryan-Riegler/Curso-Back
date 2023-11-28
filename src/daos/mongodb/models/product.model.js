import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


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

productsSchema.plugin(mongoosePaginate)

export const ProductModel = model(productsCollection, productsSchema);