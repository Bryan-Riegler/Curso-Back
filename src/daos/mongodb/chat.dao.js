import { messageModel } from "./models/chat.model.js";

export default class MessageDao {

    async getAll() {
        try {
            const response = await messageModel.find();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async createMessage(msg) {
        try {
            const response = await messageModel.create(msg);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}