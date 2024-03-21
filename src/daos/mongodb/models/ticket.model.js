import config from "../../../config/config.js";
import { Schema, model } from "mongoose";

export const ticketsCollection = config.TEST_COLLECTION === "test" ? "testTickets" : "tickets";

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

export const ticketModel = model(ticketsCollection, ticketSchema);