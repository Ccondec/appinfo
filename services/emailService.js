// services/emailService.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, cc, subject, message, attachments }) => {
  // Configurar el transporter de nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Preparar el correo
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    cc,
    subject,
    html: message,
    attachments
  };

  // Enviar el correo
  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
};