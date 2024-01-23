import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchaseDateTime: {
        type: String,
        default: new Date().toLocaleString()
    },
    amount: {
        type: Number,
        required: true
    },
    purcharser: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    }
})

export const ticketModel = model("tickets", ticketSchema);