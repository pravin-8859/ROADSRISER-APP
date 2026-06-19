import Mechanic from "../models/Mechanic.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

/* ---------------------------------- utils --------------------------------- */
const normalizePhone = (raw) =>
  raw ? String(raw).replace(/\D/g, "").slice(-10) : "";

/* ================================ SEND OTP ================================= */
export const sendOtp = async (req, res) => {
  try {
    const { email, phone: rawPhone } = req.body;

    const otp = generateOtp(4);
    const otpHash = await hashOtp(otp);
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    let mech = null;

    /* ---------- EMAIL FLOW ---------- */
    if (email && typeof email === "string") {
      const cleanEmail = email.toLowerCase().trim();

      mech = await Mechanic.findOne({ email: cleanEmail });
      if (!mech) mech = new Mechanic({ email: cleanEmail });

      mech.otpHash = otpHash;
      mech.otpExpire = otpExpire;
      mech.isVerified = false;

      await mech.save({ validateBeforeSave: false });

      await sendEmail({
        to: cleanEmail,
        subject: "Your RoadsRiser OTP",
        html: `
          <h3>RoadsRiser OTP</h3>
          <p>Your OTP is <b>${otp}</b></p>
          <p>Valid for 5 minutes</p>
        `,
      });

      console.log("MECHANIC EMAIL OTP:", otp);

      return res.json({
        success: true,
        message: "OTP sent to email",
        ...(process.env.DEBUG_SEND_OTP === "true" && { debugOtp: otp }),
      });
    }

    /* ---------- PHONE FLOW ---------- */
    const phone = normalizePhone(rawPhone);
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Valid email or phone required" });
    }

    mech = await Mechanic.findOne({ phone });
    if (!mech) mech = new Mechanic({ phone });

    mech.otpHash = otpHash;
    mech.otpExpire = otpExpire;
    mech.isVerified = false;

    await mech.save({ validateBeforeSave: false });

    console.log("MECHANIC PHONE OTP:", otp);

    return res.json({
      success: true,
      message: "OTP sent to phone",
      ...(process.env.DEBUG_SEND_OTP === "true" && { debugOtp: otp }),
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ============================== MECHANIC SIGNUP ============================ */
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

    let mech = null;

    if (cleanEmail) mech = await Mechanic.findOne({ email: cleanEmail });
    if (!mech && phone) mech = await Mechanic.findOne({ phone });

    if (!mech || !mech.otpHash)
      return res.status(400).json({ message: "OTP not requested" });

    if (new Date() > mech.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    const ok = await verifyOtpHash(otp, mech.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    /* ---- DUPLICATE PHONE CHECK (SAFE) ---- */
    if (phone) {
      const exists = await Mechanic.findOne({
        phone,
        _id: { $ne: mech._id },
      });
      if (exists)
        return res.status(400).json({ message: "Phone already registered" });

      mech.phone = phone;
    }

    mech.name = name;
    mech.email = cleanEmail;
    mech.password = password;
    mech.gst = gst;
    mech.garageName = garageName;
    mech.address = address;
    mech.isVerified = true;

    mech.otpHash = undefined;
    mech.otpExpire = undefined;

    await mech.save();

    return res.json({
      success: true,
      message: "Mechanic registered successfully",
      mechanicId: mech._id,
    });
  } catch (err) {
    console.error("mechanicSignup error:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Duplicate field error" });
    return res.status(500).json({ message: "Signup failed" });
  }
};

/* ================================ LOGIN ==================================== */
export const mechanicLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mech = await Mechanic.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!mech) return res.status(404).json({ message: "Mechanic not found" });

    const match = await mech.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(mech._id);
    const refreshToken = createRefreshToken(mech._id);

    mech.refreshToken = refreshToken;
    await mech.save();

    res.cookie("rr_refresh", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      mechanic: { id: mech._id, name: mech.name, email: mech.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ================================= LOGOUT ================================== */
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
    console.error("logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
