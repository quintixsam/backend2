import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controllers/password.controller.js";

const router = Router();

// Ruta para enviar correo de recuperación
router.post("/reset-request", requestPasswordReset);

// Ruta para cambiar la contraseñaCARTmai
router.post("/reset-password/:token", resetPassword);

export default router;
