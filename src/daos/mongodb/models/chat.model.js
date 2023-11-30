import { Schema, model } from "mongoose";

export const chatCollection = "chat";

export const messageSchema = new Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() }
})

export const messageModel = model(chatCollection, messageSchema)