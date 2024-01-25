import { hashSync, genSaltSync, compareSync } from "bcrypt";
export const createHash = (password) => {
    if (!password) {
        password = "a";
    }
    return hashSync(password, genSaltSync(10))
}

export const comparePassword = (password, user) => {
    if (!password) {
        password = "a";
    }
    return compareSync(password, user.password)
}