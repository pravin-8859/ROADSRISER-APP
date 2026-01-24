// controllers/mechanicController.js
import Mechanic from "../models/Mechanic.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

const normalizePhone = (raw) => (raw ? String(raw).replace(/\D/g, "") : "");

export const sendOtp = async (req, res) => {
  try {
    const { email, phone: rawPhone } = req.body;

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000;

    let mech;

    if (email && typeof email === "string") {
      const cleanEmail = email.toLowerCase().trim();
      mech = await Mechanic.findOne({ email: cleanEmail });

      if (!mech) {
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

      const html = `
        <div style="font-family: Arial, sans-serif; line-height:1.4">
          <h3 style="color:#4F46E5">RoadsRiser OTP</h3>
          <p>Your verification code is:</p>
          <div style="font-size:22px; font-weight:700; letter-spacing:4px; background:#f3f4f6; padding:8px 12px; display:inline-block; border-radius:6px;">
            ${otp}
          </div>
          <p style="color:#6b7280; margin-top:8px">This code will expire in 5 minutes.</p>
        </div>
      `;

      await sendEmail({ to: cleanEmail, subject: "Your RoadsRiser OTP", html });

      if (process.env.DEBUG_SEND_OTP === "true") {
        return res.json({ success: true, message: "OTP sent to email", debugOtp: otp });
      }
      return res.json({ success: true, message: "OTP sent to email" });
    }

    // phone flow
    const phone = normalizePhone(rawPhone);
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Email required for OTP or provide valid phone" });
    }

    mech = await Mechanic.findOne({ phone });
    if (!mech) {
      mech = new Mechanic({ phone, otpHash, otpExpire: expire, isVerified: false });
    } else {
      mech.otpHash = otpHash;
      mech.otpExpire = expire;
    }

    await mech.save({ validateBeforeSave: false });

    console.log("MECHANIC DEBUG OTP:", otp);
    if (process.env.DEBUG_SEND_OTP === "true") {
      return res.json({ success: true, message: "OTP sent to phone", debugOtp: otp });
    }
    return res.json({ success: true, message: "OTP sent to phone" });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "OTP error" });
  }
};

export const mechanicSignup = async (req, res) => {
  try {
    const { name, email, password, phone: rawPhone, gst, garageName, address, otp } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP required" });

    const cleanEmail = email?.toLowerCase().trim();
    const phone = normalizePhone(rawPhone);

    let mechRecord = null;
    if (cleanEmail) mechRecord = await Mechanic.findOne({ email: cleanEmail });
    if (!mechRecord && phone) mechRecord = await Mechanic.findOne({ phone });

    if (!mechRecord) return res.status(400).json({ message: "No OTP sent for this email/phone" });
    if (!mechRecord.otpHash) return res.status(400).json({ message: "OTP not found" });
    if (new Date() > mechRecord.otpExpire) return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // update record instead of creating new
    mechRecord.name = name || mechRecord.name;
    if (cleanEmail) mechRecord.email = cleanEmail;
    if (phone && /^\d{10}$/.test(phone)) mechRecord.phone = phone;
    mechRecord.password = password || mechRecord.password;
    mechRecord.gst = gst || mechRecord.gst;
    mechRecord.garageName = garageName || mechRecord.garageName;
    mechRecord.address = address || mechRecord.address;
    mechRecord.isVerified = true;

    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;

    await mechRecord.save();

    return res.json({ message: "Registered successfully", mechanicId: mechRecord._id });
  } catch (err) {
    console.error("mechanicSignup error:", err);
    if (err?.code === 11000) return res.status(400).json({ message: "Duplicate field error", error: err.keyValue });
    return res.status(500).json({ message: "Signup failed" });
  }
};

export const mechanicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const mech = await Mechanic.findOne({ email: email.toLowerCase().trim() });
    if (!mech) return res.status(404).json({ message: "Mechanic not found" });

    const match = await mech.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const access = createAccessToken(mech._id);
    const refresh = createRefreshToken(mech._id);

    mech.refreshToken = refresh;
    await mech.save();

    res.cookie("rr_refresh", refresh, { httpOnly: true, secure: false, sameSite: "lax" });

    return res.json({ success: true, message: "Login successful", accessToken: access, mechanic: { id: mech._id, name: mech.name, email: mech.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.rr_refresh;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await Mechanic.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: "" } });
      }
    }
    res.clearCookie("rr_refresh");
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// refreshAccessToken etc. kept as before (add if you need)
