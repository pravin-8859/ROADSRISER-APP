// controllers/mechanicController.js (FINAL FIXED VERSION)

import Mechanic from "../models/Mechanic.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";

// phone normalization helper
const normalizePhone = (raw) =>
  raw ? String(raw).replace(/\D/g, "") : "";

// ===========================================================
// SEND OTP (EMAIL FIRST, PHONE SECOND)
// ===========================================================
export const sendOtp = async (req, res) => {
  try {
    const { email, phone: rawPhone } = req.body;

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000;

    let mech;

    // ===========================================================
    // 1️⃣ EMAIL OTP FLOW
    // ===========================================================
    if (email && typeof email === "string") {
      const cleanEmail = email.toLowerCase().trim();

      mech = await Mechanic.findOne({ email: cleanEmail });

      if (!mech) {
        // New incomplete record (OTP only)
        mech = new Mechanic({
          email: cleanEmail,
          otpHash,
          otpExpire: expire,
          isVerified: false,
        });
      } else {
        mech.otpHash = otpHash;
        mech.otpExpire = expire;
      }

      await mech.save({ validateBeforeSave: false });

      // HTML OTP Email Template
      const html = `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#4F46E5;">RoadsRiser Verification</h2>
          <p>Your OTP is:</p>
          <div style="
            font-size: 26px;
            font-weight:bold;
            padding: 10px 18px;
            background:#f3f4f6;
            border-radius: 8px;
            display:inline-block;
            letter-spacing:4px;
          ">${otp}</div>
          <p style="margin-top:10px;color:#6b7280;">
            This OTP will expire in <strong>5 minutes</strong>.
          </p>
        </div>
      `;

      await sendEmail({
        to: cleanEmail,
        subject: "Your OTP - RoadsRiser",
        html,
      });

      if (process.env.DEBUG_SEND_OTP === "true") {
        return res.json({
          success: true,
          message: "OTP sent to email",
          debugOtp: otp,
        });
      }

      return res.json({ success: true, message: "OTP sent to email" });
    }

    // ===========================================================
    // 2️⃣ PHONE OTP FLOW
    // ===========================================================
    const phone = normalizePhone(rawPhone);

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    mech = await Mechanic.findOne({ phone });

    if (!mech) {
      mech = new Mechanic({
        phone,
        otpHash,
        otpExpire: expire,
        isVerified: false,
      });
    } else {
      mech.otpHash = otpHash;
      mech.otpExpire = expire;
    }

    await mech.save({ validateBeforeSave: false });

    // SMS NOT IMPLEMENTED — Showing debug OTP
    console.log("MECHANIC DEBUG OTP:", otp);

    if (process.env.DEBUG_SEND_OTP === "true") {
      return res.json({
        success: true,
        message: "OTP sent to phone",
        debugOtp: otp,
      });
    }

    return res.json({ success: true, message: "OTP sent to phone" });

  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "OTP error" });
  }
};
