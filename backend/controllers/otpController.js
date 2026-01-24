import { sendEmail } from "../utils/email.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";

export const sendEmailOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOtp(4); // 4 digit OTP
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000; // 5 minutes

    let Model = role === "mechanic" ? Mechanic : User;

    let person = await Model.findOne({ email });

    if (!person) {
      person = new Model({ email }); // minimal doc
    }

    person.otpHash = otpHash;
    person.otpExpire = expire;

    await person.save({ validateBeforeSave: false });

    // Email Template
    const html = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#4F46E5;">RoadsRiser Verification</h2>
        <p>Your OTP code is:</p>
        <div style="
            font-size: 26px;
            font-weight:bold;
            padding: 10px 18px;
            background:#f3f4f6;
            border-radius: 8px;
            display:inline-block;
            letter-spacing: 4px;
        ">${otp}</div>
        <p style="margin-top:10px;color:#6b7280;">
          OTP will expire in <strong>5 minutes</strong>.
        </p>
      </div>
    `;

    // Correct sendEmail call
    await sendEmail({
      to: email,
      subject: "RoadsRiser Email OTP",
      html,
    });

    return res.json({
      success: true,
      message: "OTP sent to email",
      ...(process.env.DEBUG_SEND_OTP === "true" ? { debugOtp: otp } : {})
    });

  } catch (err) {
    console.error("sendEmailOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
