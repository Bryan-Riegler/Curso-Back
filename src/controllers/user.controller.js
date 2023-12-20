import * as service from "../services/user.services.js";

export const register = async (req, res, next) => {
    try {
        const user = await service.register(req.body);
        if (user) res.redirect("/");
        else res.redirect("/registerError")
    } catch (error) {
        next(error.message);
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
        next(error.message);
    }
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al cerrar sesión');
        } else {
            console.log('Sesión destruida');
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
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const gitHubResponse = async (req, res, next) => {
    try {
        console.log(req.user);
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
        next(error.message)
    }
}