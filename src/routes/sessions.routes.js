import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
import UserDTO from "../dtos/User.dto.js";
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

// CURRENT USER (validar token JWT + DTO )
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user); 
    res.json({ user: userDTO });
});


export default router;
