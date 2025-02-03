// test-email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendTestEmail = async () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.IONOS_USER,
            pass: process.env.IONOS_PASS
        },
        tls: { rejectUnauthorized: false },        
    });

    await transporter.sendMail({
        from: `"Prueba SMTP" <${process.env.IONOS_USER}>`,
        to: "ramonserrano76@gmail.com",
        subject: "",
        text: ""
    });
    console.log("✅ Correo de prueba enviado");
};

sendTestEmail().catch(console.error);