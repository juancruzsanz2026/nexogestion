import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@nexoargentina.app',
      to,
      subject,
      html,
    });
    console.log(`✅ Email enviado a ${to}`);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};
