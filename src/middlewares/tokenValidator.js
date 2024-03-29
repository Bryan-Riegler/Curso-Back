import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import jwt from "jsonwebtoken"
import { privateKey } from "../jwt/auth.js";
import { logger } from "../utils/logger.js"

export const tokenValidator = async (req, res, next) => {
    // const authHeader = req.get("Authorization");
    const token = req.cookies.Authorization
    if (!token) return res.status(401).json({ msg: "Invalid authorization" });
    try {
        // const token = authHeader.split(" ")[1]
        const decode = jwt.verify(token, privateKey)
        const user = await userDao.findUserById(decode.userId);
        if (!user) return res.status(400).json({ msg: "Invalid authorization" });
        req.user = user;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(401).json({ msg: "Unauthorized" });
    }
}