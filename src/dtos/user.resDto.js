export default class UserResDto {
    constructor(user) {
        this.name = `${user.firstName} ${user.lastName}`,
            this.email = user.email,
            this.age = user.age,
            this.avatar = user.avatar,
            this.role = user.role
    }
}