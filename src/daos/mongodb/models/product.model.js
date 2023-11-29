import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


export const productsCollection = "products";

export const productsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean },
});

productsSchema.plugin(mongoosePaginate)

export const ProductModel = model(productsCollection, productsSchema);