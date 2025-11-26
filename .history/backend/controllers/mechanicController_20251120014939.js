import Mechanic from "../models/Mechanic.js";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
  createAccessToken as createAccess,
} from "../utils/token.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { validateGSTIN } from "../utils/gstin.js";

// ---------------------------------------------
// SEND OTP (DEBUG MODE - NO SMS REQUIRED)
// ---------------------------------------------
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000;

    let mech = await Mechanic.findOne({ phone });

    if (!mech) {
      // 🔥 Insert only OTP data, NOT full mechanic account
      mech = new Mechanic({
        phone,
        otpHash,
        otpExpire: expire,
        isVerified: false,
      });
    } else {
      // 🔥 Update existing record
      mech.otpHash = otpHash;
      mech.otpExpire = expire;
    }

    await mech.save({ validateBeforeSave: false });  
    // 🔥 THIS LINE SKIPS REQUIRED FIELD CHECK

    console.log("MECHANIC DEBUG OTP:", otp);

    return res.json({
      success: true,
      otp,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP error" });
  }
};



// ---------------------------------------------
// MECHANIC SIGNUP
// ---------------------------------------------
export const mechanicSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gst,
      garageName,
      address,
      otp,
    } = req.body;

    if (gst && !validateGSTIN(gst))
      return res.status(400).json({ message: "Invalid GST number" });

    const mechRecord = await Mechanic.findOne({ phone });

    if (!mechRecord || !mechRecord.otpHash)
      return res.status(400).json({ message: "No OTP sent" });

    if (new Date() > mechRecord.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    const exists = await Mechanic.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ message: "Email already registered" });

    const mech = await Mechanic.create({
      name,
      email,
      password,
      phone,
      gst,
      garageName,
      address,
      isVerified: true,
    });

    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;
    mechRecord.otpPurpose = undefined;
    await mechRecord.save();

    return res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Signup failed",
    });
  }
};

// ---------------------------------------------
// LOGIN
// ---------------------------------------------
export const mechanicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mech = await Mechanic.findOne({ email });

    if (!mech)
      return res.status(404).json({ message: "Mechanic not found" });

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
    console.error(err);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// ---------------------------------------------
// REFRESH ACCESS TOKEN
// ---------------------------------------------
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.rr_refresh;

    if (!token)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const mech = await Mechanic.findById(decoded.id);

    if (!mech || mech.refreshToken !== token)
      return res.status(401).json({
        message: "Invalid refresh token",
      });

    const newToken = createAccess(mech._id);

    return res.json({ accessToken: newToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

// ---------------------------------------------
// LOGOUT
// ---------------------------------------------
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

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

// ---------------------------------------------
// RESET PASSWORD
// ---------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const mech = await Mechanic.findOne({ phone });

    if (!mech || !mech.otpHash)
      return res.status(400).json({ message: "OTP not requested" });

    if (new Date() > mech.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mech.otpHash);

    if (!ok)
      return res.status(400).json({ message: "Invalid OTP" });

    mech.password = newPassword;

    mech.otpHash = undefined;
    mech.otpExpire = undefined;
    mech.otpPurpose = undefined;

    await mech.save();

    return res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Reset failed",
    });
  }
};
