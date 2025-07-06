import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = Router();


// POST /api/users/register
router.post("/register", async (req, res) => {
    try {
    const { first_name, last_name, email, age, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado", user: newUser });
    } catch (err) {
    res.status(500).json({ message: "Error al registrar usuario", error: err.message });
}
});

// GET /api/users — listar usuarios sin clave
router.get("/", async (req, res) => {
    try {
    const users = await User.find({}, "-password");
    res.json(users);
    } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

// GET /api/users/:id — get user by id
router.get("/:id", async (req, res) => {
    try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
    } catch (err) {
    res.status(500).json({ message: "Error al buscar usuario" });
    }
});

// PUT /api/users/:id — updateuser
router.put("/:id", async (req, res) => {
    try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const updateData = { first_name, last_name, email, age, role };

    if (password) {
    updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado", user: updatedUser });
    } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario" });
    }
});

// DELETE /api/users/:id — delete user
router.delete("/:id", async (req, res) => {
    try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
    } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario" });
    }
});

export default router;
