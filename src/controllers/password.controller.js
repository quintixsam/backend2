import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/password.utils.js";
import UserRepository from "../repositories/UserRepository.js";
import { sendResetPasswordEmail } from "../config/mailer.js"; // ✔️ Import correcto

const secret = process.env.RESET_PASSWORD_SECRET;
const userRepository = new UserRepository();

// ✔️ 1. Solicitud de recuperación
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

    // Enviar email con el link
    await sendResetPasswordEmail(email, token);

    res.json({ status: "success", message: "Correo de recuperación enviado" });
    } catch (error) {
    res.status(500).json({
        status: "error",
        message: "Error al enviar el correo",
        error: error.message,
    });
    }
};

// ✔️ 2. Resetear contraseña con token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
    const { email } = jwt.verify(token, secret);

    const user = await userRepository.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isSamePassword = isValidPassword(newPassword, user.password);
    if (isSamePassword) {
        return res
        .status(400)
        .json({ message: "No puedes usar la misma contraseña anterior." });
    }

    const hashedPassword = createHash(newPassword);
    await userRepository.changePassword(user._id, hashedPassword);

    res.json({
        status: "success",
        message: "Contraseña actualizada correctamente",
    });
    } catch (error) {
    res.status(400).json({
        status: "error", 
        message: "Token inválido o expirado",
        error: error.message,
    });
    }
};
