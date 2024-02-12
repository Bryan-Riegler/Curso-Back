import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import jwt from "jsonwebtoken"
import { privateKey } from "../jwt/auth.js";
import { logger } from "../utils/logger.js"

export const checkUserRole = async (req, res, next) => {
    try {
        if (req.cookies.Authorization) {
            const token = req.cookies.Authorization
            const decode = jwt.verify(token, privateKey)
            req.session.userId = decode.userId
        }
        const id = req.session.userId
        const user = await userDao.findUserById(id);

        if (user.role === "user" || user.role === "premium") {
            next();
        } else res.status(403).json({ error: 'Acceso no autorizado' });

    } catch (error) {
        logger.error(error);
    }
}