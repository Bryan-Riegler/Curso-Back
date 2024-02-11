import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import UserRepository from "../repository/user.repository.js";
const userRepository = new UserRepository();
import { sendMail } from "./mailing.services.js";
export const register = async (user) => {
    try {
        const response = await userDao.register(user);
        await sendMail(user, "register")
        if (!response) return false;
        else return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const login = async (email, password) => {
    try {
        const response = await userDao.login(email, password);
        if (!response) return false;
        else return response;
    } catch (error) {
        throw new Error(error.message)
    }
}



export const getUserProfile = async (userId) => {
    try {
        const user = await userRepository.getProfile(userId);
        if (!user) return false;
        // const { _id, __v, password, ...userData } = user.toObject();
        return user;
    } catch (error) {
        throw new Error(error.message)
    }
};

export const resetPassword = async (user) => {
    try {
        const token = await userDao.resetPassword(user);
        if (token) return await sendMail(user, "resetPassword", token);
        else return false;
    } catch (error) {
        throw new Error(error)
    }
}

export const updatePassword = async (user, password) => {
    try {
        const response = await userDao.updatePassword(user, password);
        if (!response) return false;
        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}