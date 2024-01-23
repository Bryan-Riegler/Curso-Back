import { ticketModel } from "./models/ticket.model.js";
import { randomCode } from "../../utils/randomCode.js";
import { totalAmount } from "../../utils/totalAmount.js";
import { totalPrice } from "../../utils/totalPrice.js";
// import CartDaoMongo from "./cart.dao.js";
// const cartDao = new CartDaoMongo();

export default class TicketDao {
    async createTicket(cartId, email) {
        try {
            const code = randomCode();
            const amount = await totalAmount(cartId)
            const purcharser = email;
            const price = await totalPrice(cartId)

            const ticket = ticketModel.create({ code, amount, purcharser, price });
            return ticket;
        } catch (error) {
            console.log(error);
        }

    }
}