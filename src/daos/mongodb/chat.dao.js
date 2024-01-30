import { messageModel } from "./models/chat.model.js";

export default class MessageDao {

    async getAll() {
        try {
            const response = await messageModel.find();
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createMessage(msg) {
        try {
            const response = await messageModel.create(msg);
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}