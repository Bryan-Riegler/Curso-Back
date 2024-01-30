import { Schema, model } from "mongoose";

const fakeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean }
});

export const FakeModel = model("fakeProducts", fakeSchema);