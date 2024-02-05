import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import * as service from "../services/user.services.js";
import { generateToken } from "../jwt/auth.js";
import { logger } from "../utils/logger.js"

export const register = async (req, res, next) => {
    try {
        const user = await service.register(req.body);
        if (user) res.redirect("/");
        else res.redirect("/registerError")
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await service.login(email, password);
        if (user) {
            req.session.email = email;
            req.session.password = password;
            req.session.firstName = user.firstName;
            req.session.userId = user._id;
            res.redirect("/home");
        } else res.redirect("/loginError");
    } catch (error) {
        next(error);
    }
}

export const loginJwt = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.login(email, password);
        if (!user) res.json({ msg: "Invalid user" })
        const accessToken = generateToken(user);
        // res.header("Authorization", accessToken).json({ msg: "login ok", accessToken })
        res.cookie("Authorization", accessToken, { httpOnly: true }).json({ msg: "login ok", accessToken });
    } catch (error) {
        next(error)
    }
}

export const registerJwt = async (req, res, next) => {
    try {
        const { firstName, lastName, email, age, password } = req.body;
        const exist = await userDao.findByEmail(email);
        if (exist) return res.status(400).json({ msg: "User already exists" });
        const user = { firstName, lastName, email, age, password };
        const newUser = await userDao.register(user);
        res.json({
            msg: "Register OK",
            newUser,
        });
    } catch (error) {
        next(error);
    }
};

export const privateRoute = async (req, res) => {
    const { firstName, lastName, email, role } = req.user;
    res.json({
        status: "success",
        userData: {
            firstName,
            lastName,
            email,
            role,
        },
    });
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error(err);
            res.status(500).send('Error al cerrar sesión');
        } else {
            logger.info('Sesión destruida');
            res.redirect('/');
        }
    });
};

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userProfile = await service.getUserProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const gitHubResponse = async (req, res, next) => {
    try {
        logger.info(req.user);
        const { firstName, lastName, email, isGithub, avatar, cart } = req.user
        req.session.firstName = firstName
        res.json({
            msg: "Registered or logged in as a GitHub account",
            session: req.session,
            user: {
                firstName,
                lastName,
                email,
                isGithub,
                avatar,
                cart
            }
        })
    } catch (error) {
        next(error)
    }
}