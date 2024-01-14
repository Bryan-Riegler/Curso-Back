import "dotenv/config"
import jwt from "jsonwebtoken";


export const privateKey = process.env.PRIVATE_KEY;

export const generateToken = (user) => {
    const payload = {
        userId: user._id
    };

    const token = jwt.sign(payload, privateKey, {
        expiresIn: "15m"
    });

    return token;
}