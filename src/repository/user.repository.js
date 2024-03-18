import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import UserResDto from "../dtos/user.resDto.js";
import { logger } from "../utils/logger.js"

export default class UserRepository {
    constructor() {
        this.dao = userDao
    }

    async getProfile(id) {
        try {
            const user = await this.dao.findUserById(id);
            return new UserResDto(user);
        } catch (error) {
            logger.error(error);
        }
    }
    async getAllUsers() {
        try {
            const users = await this.dao.getAllUsers();
            const usersDto = users.map(user => new UserResDto(user));
            return usersDto
        } catch (error) {
            logger.error(error);
        }
    }
}
