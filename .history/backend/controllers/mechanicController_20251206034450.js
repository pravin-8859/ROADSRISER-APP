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

    // ✅ Always prefer EMAIL flow
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
        <h2>RoadsRiser Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
      `;

      await sendEmail({
        to: cleanEmail,
        subject: "Your RoadsRiser OTP",
        html,
      });

      return res.json({ success: true, message: "OTP sent to email" });
    }

    // ✅ Only if email not given, fallback to phone
    const phone = normalizePhone(rawPhone);
    if (phone && /^\d{10}$/.test(phone)) {
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

      console.log("OTP:", otp);
      return res.json({ success: true, message: "OTP sent to phone" });
    }

    // ✅ If neither email nor valid phone
    return res.status(400).json({ message: "Email required for OTP" });

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

    if (!otp) return res.status(400).json({ message: "OTP required" });

    const phone = normalizePhone(rawPhone);
    const cleanEmail = email?.toLowerCase().trim();

    let mechRecord = null;

    // ✅ Email-Based Signup (preferred)
    if (cleanEmail) {
      mechRecord = await Mechanic.findOne({ email: cleanEmail });
    }

    // ✅ Phone-Based Signup only if email not given
    if (!mechRecord && phone) {
      mechRecord = await Mechanic.findOne({ phone });
    }

    if (!mechRecord)
      return res.status(400).json({ message: "No OTP sent for this email/phone" });

    if (!mechRecord.otpHash)
      return res.status(400).json({ message: "OTP not found" });

    if (new Date() > mechRecord.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Save details
    mechRecord.name = name;
    mechRecord.email = cleanEmail;
    if (phone && /^\d{10}$/.test(phone)) {
      mechRecord.phone = phone;
    } // optional
    mechRecord.password = password;
    mechRecord.gst = gst;
    mechRecord.garageName = garageName;
    mechRecord.address = address;
    mechRecord.isVerified = true;

    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;

    await mechRecord.save();

    return res.json({
      message: "Registered successfully",
      mechanicId: mechRecord._id,
    });

  } catch (err) {
    console.error("mechanicSignup error:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Duplicate field error" });
    return res.status(500).json({ message: "Signup failed" });
  }
};

    // -------------------------------
    // OTP Verify
    // -------------------------------
    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // -------------------------------
    // Continue registration
    // -------------------------------
    mechRecord.name = name;
    mechRecord.email = cleanEmail;
    mechRecord.phone = phone;
    mechRecord.password = password;
    mechRecord.gst = gst;
    mechRecord.garageName = garageName;
    mechRecord.address = address;
    mechRecord.isVerified = true;

    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;

    await mechRecord.save();

    return res.json({
      message: "Registered successfully",
      mechanicId: mechRecord._id,
    });

  } catch (err) {
    console.error("mechanicSignup error:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Duplicate field error" });
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
