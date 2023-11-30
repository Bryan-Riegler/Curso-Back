import MessageDao from "../daos/mongodb/chat.dao.js";
const messageDao = new MessageDao();

export const getAll = async () => {
    try {
        const messages = await messageDao.getAll();
        return messages;
    } catch (error) {
        console.log(error);
    }
}

export const createMessage = async (msg) => {
    try {
        const message = await messageDao.createMessage(msg);
        return message;
    } catch (error) {
        console.log(error);
    }
}