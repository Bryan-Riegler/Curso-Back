import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();
import * as services from "../services/user.services.js";

const strategyOptions = {

    clientID: 'Iv1.8b841a821e1b9916',
    clientSecret: 'c37ab8614d4bdabcf1309b5842872208bd24a713',
    callbackURL: 'http://localhost:8080/user/github'
}

const registerLogin = async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    const email = profile._json.email;
    const fullName = profile._json.name;
    const nameParts = fullName.split(' ');
    let firstName, lastName;
    if (nameParts.length > 1) {
        lastName = nameParts.pop();
        firstName = nameParts.join(' ');
    } else {
        firstName = nameParts[0];
        lastName = '';
    }

    const user = await userDao.findByEmail(email);
    if (user) return done(null, user);
    const newUser = await services.register({
        firstName,
        lastName,
        email,
        isGithub: true,
        avatar: profile._json.avatar_url
    })
    return done(null, newUser);
};

passport.use('github', new GithubStrategy(strategyOptions, registerLogin));

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    const user = await userDao.findUserById(id);
    return done(null, user);
});