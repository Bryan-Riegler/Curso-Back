import { Schema, model } from "mongoose"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
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
        default: "user",
    },
    isGithub: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "",
    }
})

export const userModel = model("users", userSchema);