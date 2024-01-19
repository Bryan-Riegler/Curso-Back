import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();

export const checkAdminRole = async (req, res, next) => {
    try {
        const id = req.session.userId;
        const user = await userDao.findUserById(id);


        if (user.role === "admin") {
            next();
        } else res.status(403).json({ error: 'Acceso no autorizado' });

    } catch (error) {
        console.log(error);
    }
}