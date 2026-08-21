import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Make sure .env is loaded before reading SMTP variables
dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    if (!smtpUser || !smtpPass) {
      console.error("❌ SMTP credentials missing");
      console.error("SMTP_USER exists:", Boolean(smtpUser));
      console.error("SMTP_PASS exists:", Boolean(smtpPass));
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure:
        String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"RoadsRiser" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", to);

    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error);

    return false;
  }
};