import { comparePassword, createHash } from "../../utils.js";
import { userModel } from "./models/user.model.js";

export default class UserDao {
    async findByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            console.log(error);
        }
    }

    async register(user) {
        try {
            const { email, password } = user;
            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                return await userModel.create({ ...user, password: createHash(password), role: 'admin' });
            }
            const exist = await this.findByEmail(email);
            if (!exist) return await userModel.create({ ...user, password: createHash(password) });
            else return false;
        } catch (error) {
            console.log(error);
        }
    }

    async login(email, password) {
        try {
            const exist = await userModel.findOne({ email });
            if (exist) {
                const comparePass = comparePassword(password, exist)
                if (!comparePass) return false;
                else return exist
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    async findUserById(userId) {
        try {
            return await userModel.findById(userId);
        } catch (error) {
            console.log(error);
        }
    };
}

