import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// LOGIN
router.post("/login", (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err || !user) return res.status(401).json({ error: info?.message || "Login inválido" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
    })(req, res, next);
});

// CURRENT USER (validar token JWT)
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
    user: {
        id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role
    }
});
});

export default router;
