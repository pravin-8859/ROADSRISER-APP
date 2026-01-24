import { sendEmail } from "../utils/email.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import User from "../models/User.js";
import Mechanic from "../models/Mechanic.js";

export const sendEmailOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // OTP generate
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000; // 5 min

    let Model = null;
    if (role === "mechanic") Model = Mechanic;
    else Model = User;

    let person = await Model.findOne({ email });

    if (!person) {
      person = new Model({ email });
    }

    person.otpHash = otpHash;
    person.otpExpire = expire;

    await person.save({ validateBeforeSave: false });

    // Email Template
    const html = `
      <h2>Your RoadsRiser OTP</h2>
      <p style="font-size:18px"><b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;

    await sendEmail(email, "RoadsRiser Email OTP", html);

    return res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
