import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import jwt from "jsonwebtoken"
import { privateKey } from "../jwt/auth.js";
import { logger } from "../utils/logger.js"

export const checkAdminRole = async (req, res, next) => {
    try {
        if (req.cookies.Authorization) {
            const token = req.cookies.Authorization
            const decode = jwt.verify(token, privateKey)
            req.session.userId = decode.userId
        }
        const id = req.session.userId
        const user = await userDao.findUserById(id);


        if (!user || user.role !== "admin") {
            res.status(403).json({ error: 'Acceso no autorizado' });
        } else next()

    } catch (error) {
        logger.error(error);
    }
}