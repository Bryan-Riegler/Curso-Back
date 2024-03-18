import { comparePassword, createHash } from "../../utils/hashPassword.js";
import { userModel } from "./models/user.model.js";
import CartDao from "./cart.dao.js"
const cartDao = new CartDao();
import { logger } from "../../utils/logger.js";
import { generateToken } from "../../jwt/auth.js";

export default class UserDao {
    async findByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            logger.error(error);
        }
    }

    async register(user) {
        try {
            const { email, password } = user;
            if (email === 'adminCoder@coder.com') {
                const cart = await cartDao.createCart();
                const cartId = cart._id;
                return await userModel.create({ ...user, password: createHash(password), role: 'admin', cart: cartId });
            }
            const exist = await this.findByEmail(email);
            if (!exist) {
                const cart = await cartDao.createCart();
                const cartId = cart._id;
                const newUser = await userModel.create({ ...user, password: createHash(password), cart: cartId });
                return newUser;
            }
            else return false;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async login(email, password) {
        try {
            const exist = await userModel.findOne({ email });
            if (exist) {
                const comparePass = comparePassword(password, exist)
                if (!comparePass) return false;
                exist.last_connection = new Date()
                await exist.save();
                // console.log(exist)
                return exist
            }
            return false;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async findUserById(userId) {
        try {
            return await userModel.findById(userId);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async resetPassword(user) {
        try {
            const { email } = user;
            const userExist = await this.findByEmail(email);
            if (userExist) return generateToken(userExist, "1h");
            else return false;
        } catch (error) {
            console.log(error)
        }
    }

    async update(userId, updateFields) {
        try {
            return await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updatePassword(user, password) {
        try {
            const isEqual = comparePassword(password, user)
            if (isEqual) return false;
            const newPassword = createHash(password);
            return await this.update(user._id, { password: newPassword })
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getAllUsers() {
        try {
            const getAll = await userModel.find()
            if (!getAll) return false;
            else return getAll
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

