import { createTicket } from "../services/ticket.services.js";

export const Ticket = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const email = req.session.email;
        const ticket = await createTicket(cartId, email);
        if (!ticket) res.status(404).json({ msg: "Error creating ticket" });
        else res.status(200).json({ msg: "ticket created successfully", ticket });
    } catch (error) {
        next(error.message);
    }
}