import User from "../models/User.js";
import { generateOtp } from "../utils/otp.js";

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
    const { name, email, password, phone, otp } = req.body;

    if (otpStore[phone] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await User.create({
      name,
      email,
      password,
      phone,
    });

    delete otpStore[phone];

    return res.json({ message: "Registered Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

// ---------------------------------------------
// USER LOGIN
// ---------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    return res.json({
      message: "Login successful",
      token: user._id, // OR JWT token if you use JWT
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
};
