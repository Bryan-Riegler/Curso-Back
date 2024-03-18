import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import UserRepository from "../repository/user.repository.js";
const userRepository = new UserRepository();
import { userModel } from "../daos/mongodb/models/user.model.js";
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
        await sendMail(user, "passChanged")
        return response;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const deleteUsers = async () => {
    try {
        let time = new Date();
        time.setDate(time.getDate() - 2);

        let inactiveUsers = await userModel.find({ last_connection: { $lt: time }, role: { $ne: "admin" } })
        inactiveUsers.forEach(async (user) => {
            await sendMail(user, "delete");
            await userModel.findByIdAndDelete(user._id);
        })
        return inactiveUsers.length
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getAllUsers = async () => {
    try {
        const users = await userRepository.getAllUsers();
        if (!users) return false;

        return users
    } catch (error) {
        throw new Error(error.message)
    }
}