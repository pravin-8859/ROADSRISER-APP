// utils/email.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Using Gmail with App Password (recommended for testing)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // example: your.email@gmail.com
        pass: process.env.SMTP_PASS, // App password (NOT normal account password)
      },
    });

    await transporter.sendMail({
      from: `"RoadsRiser" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to:", to);
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};
