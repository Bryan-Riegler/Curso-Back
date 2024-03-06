import config from "../../../config/config.js";
import { Schema, model } from "mongoose"

export const userCollection = config.TEST_COLLECTION ? "Testusers" : "users";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin", "premium"],
        default: "user",
    },
    isGithub: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "",
    },
    cart: {
        type: String,
        default: "",
    }

})

export const userModel = model(userCollection, userSchema);