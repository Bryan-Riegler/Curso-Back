import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();

export const register = async (user) => {
    try {
        const response = await userDao.register(user);
        if (!response) return false;
        else return response;
    } catch (error) {
        console.log(error);
    }
}

export const login = async (email, password) => {
    try {
        const response = await userDao.login(email, password);
        if (!response) return false;
        else return response;
    } catch (error) {
        console.log(error);
    }
}

export const getUserProfile = async (userId) => {
    try {
        const user = await userDao.findUserById(userId);
        if (!user) return false;
        const { _id, __v, password, ...userData } = user.toObject();
        return userData;
    } catch (error) {
        console.log(error);
    }
};