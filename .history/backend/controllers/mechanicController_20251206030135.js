import Mechanic from "../models/Mechanic.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";
import {
  createAccessToken,
  createRefreshToken,
  createAccessToken as createAccess,
} from "../utils/token.js";
import jwt from "jsonwebtoken";

// Normalize phone digits only
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

    // =============================
    // 1️⃣ EMAIL OTP FLOW
    // =============================
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

      // HTML Email Template
      const html = `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#4F46E5;">RoadsRiser Verification</h2>
          <p>Your OTP:</p>
          <div style="
            font-size: 28px;
            font-weight: bold;
            padding: 12px 20px;
            background: #f3f4f6;
            border-radius: 10px;
            display:inline-block;
            letter-spacing: 4px;
          ">${otp}</div>
          <p style="margin-top:10px;color:#6b7280;">
            Expires in <strong>5 minutes</strong>.
          </p>
        </div>
      `;

      await sendEmail({
        to: cleanEmail,
        subject: "Your OTP - RoadsRiser",
        html,
      });

      return res.json({
        success: true,
        message: "OTP sent to email",
        ...(process.env.DEBUG_SEND_OTP === "true" ? { debugOtp: otp } : {}),
      });
    }

    // =============================
    // 2️⃣ PHONE OTP FLOW
    // =============================
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

    console.log("DEBUG OTP:", otp);

    return res.json({
      success: true,
      message: "OTP sent to phone",
      ...(process.env.DEBUG_SEND_OTP === "true" ? { debugOtp: otp } : {}),
    });

  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "OTP error" });
  }
};

// ===========================================================
// SIGNUP
// ===========================================================
export const mechanicSignup = async (req, res) => {
  try {
    const { name, email, password, phone, gst, garageName, address, otp } =
      req.body;

    const cleanEmail = email?.toLowerCase();
    const cleanPhone = normalizePhone(phone);

    const mech = await Mechanic.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (!mech || !mech.otpHash)
      return res.status(400).json({ message: "OTP not sent" });

    if (new Date() > mech.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mech.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // Update existing record
    mech.name = name;
    mech.email = cleanEmail;
    mech.password = password;
    mech.phone = cleanPhone;
    mech.gst = gst;
    mech.garageName = garageName;
    mech.address = address;
    mech.isVerified = true;

    mech.otpHash = undefined;
    mech.otpExpire = undefined;

    await mech.save();

    return res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
};

// ===========================================================
// LOGIN
// ===========================================================
export const mechanicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mech = await Mechanic.findOne({ email: email.toLowerCase() });
    if (!mech) return res.status(404).json({ message: "Mechanic not found" });

    const match = await mech.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const access = createAccessToken(mech._id);
    const refresh = createRefreshToken(mech._id);

    mech.refreshToken = refresh;
    await mech.save();

    res.cookie("rr_refresh", refresh, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token: access,
      mechanic: {
        id: mech._id,
        name: mech.name,
        email: mech.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

// ===========================================================
// REFRESH TOKEN
// ===========================================================
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.rr_refresh;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const mech = await Mechanic.findById(decoded.id);
    if (!mech || mech.refreshToken !== token)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newToken = createAccess(mech._id);

    return res.json({ accessToken: newToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ===========================================================
// LOGOUT
// ===========================================================
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.rr_refresh;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await Mechanic.findByIdAndUpdate(decoded.id, {
          $unset: { refreshToken: "" },
        });
      }
    }

    res.clearCookie("rr_refresh");

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

// ===========================================================
// RESET PASSWORD
// ===========================================================
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const cleanPhone = normalizePhone(phone);

    const mech = await Mechanic.findOne({ phone: cleanPhone });
    if (!mech || !mech.otpHash)
      return res.status(400).json({ message: "OTP not requested" });

    if (new Date() > mech.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mech.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    mech.password = newPassword;
    mech.otpHash = undefined;
    mech.otpExpire = undefined;

    await mech.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(500).json({ message: "Reset failed" });
  }
};
