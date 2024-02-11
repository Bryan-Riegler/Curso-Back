import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import jwt from "jsonwebtoken";
import { privateKey } from "../jwt/auth.js";

export const checkAuth = async (req, res, next) => {
    try {
        if (req.cookies.Authorization) {
            const token = req.cookies.Authorization;
            const decode = jwt.verify(token, privateKey)
            req.session.userId = decode.userId;
        }

        const id = req.session.userId;
        const user = await userDao.findUserById(id);
        if (!user) return res.status(400).json({ msg: "Unauthorized" });
        req.user = user
        next()
    } catch (error) {
        throw new Error(error.message)
    }
}