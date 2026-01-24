import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",  // <-- Gmail ke liye BEST & SIMPLE
      auth: {
        user: process.env.SMTP_USER,  // your email
        pass: process.env.SMTP_PASS,  // your App Password
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
