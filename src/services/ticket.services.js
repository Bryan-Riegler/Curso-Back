import TicketDao from "../daos/mongodb/ticket.dao.js";
const ticketDao = new TicketDao();
import CartDaoMongo from "../daos/mongodb/cart.dao.js";
const cartdao = new CartDaoMongo();
import { validateStock } from "../utils/validateStock.js";
import { updateProductsStock } from "../utils/updateProductsStock.js";
import { logger } from "../utils/logger.js";

export const createTicket = async (cartId, email) => {
    try {
        const isStock = await validateStock(cartId)
        if (!isStock) {
            logger.error("Stock error")
            return false;
        }

        const cart = await cartdao.getCartById(cartId);
        if (!cart) {
            logger.error("Cart not found")
            return false;
        }

        const productsToUpdateStock = cart.products.map((cartItem) => ({
            productId: cartItem.product,
            quantity: cartItem.quantity,
        }));

        const response = await ticketDao.createTicket(cartId, email);
        if (!response) return false;

        const stockUpdate = await updateProductsStock(productsToUpdateStock);
        if (!stockUpdate) return false;



        cart.products = []
        await cart.save();
        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}