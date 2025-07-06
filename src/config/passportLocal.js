import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";
import bcrypt from "bcrypt";

    export function initPassport() {
    passport.use("login", new LocalStrategy({
    usernameField: "email"
    }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Usuario no encontrado" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

        return done(null, user); 
        } catch (error) {
    return done(error);
    }
}));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
}
