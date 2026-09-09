import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    // Port 465 ke liye true, port 587 ke liye false
    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? String(process.env.SMTP_SECURE).trim().toLowerCase() === "true"
        : smtpPort === 465;

    if (!smtpUser || !smtpPass) {
      console.error("❌ SMTP credentials missing");
      console.error("SMTP_USER exists:", Boolean(smtpUser));
      console.error("SMTP_PASS exists:", Boolean(smtpPass));
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // SMTP connection verify karega
    await transporter.verify();

    await transporter.sendMail({
      from: `"RoadsRiser" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", to);

    return true;
  } catch (error) {
    console.error("❌ Email sending error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });

    return false;
  }
};