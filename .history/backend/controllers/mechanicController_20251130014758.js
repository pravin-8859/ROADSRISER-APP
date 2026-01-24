import Mechanic from "../models/Mechanic.js";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
  createAccessToken as createAccess,
} from "../utils/token.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { validateGSTIN } from "../utils/gstin.js";

// helper to normalize phone (digits only)
const normalizePhone = (raw) => (raw ? String(raw).replace(/\D/g, "") : "");

export const sendOtp = async (req, res) => {
  try {
    const rawPhone = req.body.phone || req.body.mobile || req.body.number;
    const phone = normalizePhone(rawPhone);

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000; // 5 minutes

    // find existing mechanic record by phone
    let mech = await Mechanic.findOne({ phone });

    if (!mech) {
      // create a minimal doc (phone + otp) — validateBeforeSave false to skip required checks
      mech = new Mechanic({
        phone,
        otpHash,
        otpExpire: expire,
        isVerified: false,
      });
    } else {
      // update otp fields on existing record
      mech.otpHash = otpHash;
      mech.otpExpire = expire;
    }

    await mech.save({ validateBeforeSave: false });

    // DEBUG: print OTP in server logs (safe for dev)
    console.log("MECHANIC DEBUG OTP:", otp);

    return res.json({ success: true, message: "OTP sent", debugOtp: otp });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "OTP error" });
  }
};

export const mechanicSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone: rawPhone,
      gst,
      garageName,
      address,
      otp,
    } = req.body;

    const phone = normalizePhone(rawPhone);

    if (gst && !validateGSTIN(gst)) {
      return res.status(400).json({ message: "Invalid GST number" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // find the OTP holder record
    const mechRecord = await Mechanic.findOne({ phone });

    if (!mechRecord || !mechRecord.otpHash) {
      return res.status(400).json({ message: "No OTP sent for this number" });
    }

    if (new Date() > mechRecord.otpExpire) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // verify otp provided
    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If email is provided, ensure it's not used by some other mechanic
    if (email) {
      const existingEmail = await Mechanic.findOne({
        email: email.toLowerCase(),
        _id: { $ne: mechRecord._id },
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Now update the existing OTP doc with the signup details (do NOT create a new doc)
    mechRecord.name = name || mechRecord.name;
    mechRecord.email = email ? String(email).toLowerCase() : mechRecord.email;
    if (password) mechRecord.password = password; // hashed via pre-save
    mechRecord.gst = gst || mechRecord.gst;
    mechRecord.garageName = garageName || mechRecord.garageName;
    mechRecord.address = address || mechRecord.address;
    mechRecord.isVerified = true;

    // clear OTP fields
    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;

    await mechRecord.save();

    return res.json({ message: "Registered successfully", mechanicId: mechRecord._id });
  } catch (err) {
    console.error("mechanicSignup error:", err);
    // If the error is a duplicate key (very unlikely now), return a readable message
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Duplicate field error", error: err.keyValue });
    }
    return res.status(500).json({ message: "Signup failed" });
  }
};

export const mechanicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const mech = await Mechanic.findOne({ email: String(email).toLowerCase() });

    if (!mech) return res.status(404).json({ message: "Mechanic not found" });

    const isMatch = await mech.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const accessToken = createAccessToken(mech._id);
    const refreshToken = createRefreshToken(mech._id);

    mech.refreshToken = refreshToken;
    await mech.save();

    res.cookie("rr_refresh", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      mechanic: {
        id: mech._id,
        name: mech.name,
        email: mech.email,
      },
    });
  } catch (err) {
    console.error("mechanicLogin error:", err);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

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
    console.error("refreshAccessToken error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
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
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { phone: rawPhone, otp, newPassword } = req.body;
    const phone = normalizePhone(rawPhone);

    const mech = await Mechanic.findOne({ phone });
    if (!mech || !mech.otpHash) return res.status(400).json({ message: "OTP not requested" });
    if (new Date() > mech.otpExpire) return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mech.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    mech.password = newPassword;
    mech.otpHash = undefined;
    mech.otpExpire = undefined;
    await mech.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Reset failed" });
  }
};
