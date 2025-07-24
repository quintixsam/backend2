import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.MAIL_USER,     
    pass: process.env.MAIL_PASS       
    }
});

export const sendResetPasswordEmail = async (to, token) => {
    const resetLink = `http://localhost:8080/reset-password/${token}`; 

    await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Recuperación de contraseña',
    html: `
    <h1>Restablecer Contraseña</h1>
    <p>Haz clic en el siguiente botón para restablecer tu contraseña (válido por 1 hora):</p>
    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none;">Restablecer Contraseña</a>`
    });
};
