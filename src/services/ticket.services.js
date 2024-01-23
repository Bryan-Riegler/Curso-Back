import TicketDao from "../daos/mongodb/ticket.dao.js";
const ticketDao = new TicketDao();
import CartDaoMongo from "../daos/mongodb/cart.dao.js";
const cartdao = new CartDaoMongo();
import { validateStock } from "../utils/validateStock.js";

export const createTicket = async (cartId, email) => {
    try {
        const isStock = await validateStock(cartId)
        if (!isStock) return false;

        const cart = await cartdao.getCartById(cartId);
        if (!cart) return false;

        const response = await ticketDao.createTicket(cartId, email);
        if (!response) return false;

        cart.products = []
        await cart.save();
        return response;
    } catch (error) {
        console.log(error);
    }
}