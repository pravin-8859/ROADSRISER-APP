import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpHost =
      process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    const smtpSecure =
      process.env.SMTP_SECURE !== undefined
        ? String(process.env.SMTP_SECURE).trim().toLowerCase() === "true"
        : smtpPort === 465;

    console.log("📧 SMTP config:", {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      user: smtpUser,
      passExists: Boolean(smtpPass),
    });

    if (!smtpUser || !smtpPass) {
      console.error("❌ SMTP_USER or SMTP_PASS is missing");
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

    await transporter.verify();

    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"RoadsRiser" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("📨 Message ID:", info.messageId);
    console.log("📬 Accepted:", info.accepted);
    console.log("❌ Rejected:", info.rejected);

    return true;
  } catch (error) {
    console.error("❌ Email sending error:", {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
    });

    return false;
  }
};