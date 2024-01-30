import { createTicket } from "../services/ticket.services.js";
import jwt from "jsonwebtoken"
import { privateKey } from "../jwt/auth.js";
import UserDao from "../daos/mongodb/user.dao.js";
import { errorsDictionary } from "../utils/errorsDictionary.js";
const userDao = new UserDao();

export const Ticket = async (req, res, next) => {
    try {
        if (req.cookies.Authorization) {
            const token = req.cookies.Authorization
            const decode = jwt.verify(token, privateKey)
            console.log(decode)
            const user = await userDao.findUserById(decode.userId)
            console.log(user)
            req.session.email = user.email
        }


        const { cartId } = req.params;
        const email = req.session.email;
        const ticket = await createTicket(cartId, email);
        if (!ticket) res.status(404).json({ msg: errorsDictionary.ERROR_CREATE });
        else res.status(200).json({ msg: "ticket created successfully", ticket });
    } catch (error) {
        next(error);
    }
}