import User from "../models/User.js";
import { generateOtp } from "../utils/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
let otpStore = {}; // TEMP for debug mode

// ---------------------------------------------
// SEND OTP (DEBUG MODE)
// ---------------------------------------------
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const otp = generateOtp(4);
    otpStore[phone] = otp;

    console.log("USER DEBUG OTP:", otp);

    return res.json({
      message: "OTP sent (debug mode)",
      otp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ---------------------------------------------
// USER REGISTER
// ---------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITH PHONE
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ---------------------------------------------
// USER LOGIN
// ---------------------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    token,
    message: "Login successful",
  });
};

