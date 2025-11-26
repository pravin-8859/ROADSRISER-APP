import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory OTP storage (can replace with Redis for production)
let otpStore = {};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ------------------------------
// SEND OTP
// ------------------------------
export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10)
    return res.status(400).json({ error: "Invalid phone number" });

  // Generate random OTP (or use demo OTP)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  otpStore[phone] = otp;

  console.log("OTP for", phone, "=", otp);

  // In real app → send via SMS gateway
  return res.json({
    message: "OTP sent successfully",
    otp, // DEMO: remove this in production
  });
};

// ------------------------------
// REGISTER USER
// ------------------------------
export const registerUser = async (req, res) => {
  const { name, email, password, phone, otp } = req.body;

  if (!name || !email || !password || !phone || !otp)
    return res.status(400).json({ error: "All fields are required" });

  // OTP validation
  if (otpStore[phone] !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  // Check user already exists
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing)
    return res.status(400).json({ error: "User already exists" });

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password: hashed,
  });

  // Clear OTP
  delete otpStore[phone];

  res.json({
    message: "Account created successfully",
    user,
  });
};

// ------------------------------
// USER LOGIN
// ------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });

  const token = generateToken(user._id);

  res.json({
    message: "Login successful",
    token,
    user,
  });
};
