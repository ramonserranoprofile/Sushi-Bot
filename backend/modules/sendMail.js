import nodemailer from 'nodemailer';

async function sendEmail(subject, body, toEmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente.');
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
}
export default sendEmail;