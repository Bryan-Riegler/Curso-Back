import config from "../config/config.js";
import jwt from "jsonwebtoken";


export const privateKey = config.PRIVATE_KEY;

export const generateToken = (user, time) => {
    const payload = {
        userId: user._id
    };

    const token = jwt.sign(payload, privateKey, {
        expiresIn: time
    });

    return token;
}

