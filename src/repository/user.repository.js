import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import UserResDto from "../dtos/user.resDto.js";

export default class UserRepository {
    constructor() {
        this.dao = userDao
    }

    async getProfile(id) {
        try {
            const user = await this.dao.findUserById(id);
            return new UserResDto(user);
        } catch (error) {
            console.log(error);
        }
    }
}
