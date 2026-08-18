import User from "../models/User.js";
import { generateOtp } from "../utils/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let otpStore = {};

// ================================ SEND OTP ================================
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number",
      });
    }

    const otp = generateOtp(4);

    otpStore[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log("USER DEBUG OTP:", otp);

    return res.json({
      success: true,
      message: "OTP sent (debug mode)",
      otp,
    });
  } catch (err) {
    console.error("sendOtp error:", err);

    return res.status(500).json({
      error: "Failed to send OTP",
    });
  }
};

// ================================ REGISTER ================================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone?.trim() || undefined;

    // Check email
    const emailExists = await User.findOne({
      email: cleanEmail,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Check phone only when provided
    if (cleanPhone) {
      const phoneExists = await User.findOne({
        phone: cleanPhone,
      });

      if (phoneExists) {
        return res.status(400).json({
          message: "Phone already registered",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email or phone already registered",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================================= LOGIN =================================
export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        type: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// ================================ GET ME ================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("getMe error:", err);

    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
};

// ============================= UPDATE PROFILE ============================
export const updateMe = async (req, res) => {
  try {
    const {
      name,
      phone,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      const cleanPhone = phone.trim();

      if (
        cleanPhone &&
        !/^\d{10}$/.test(cleanPhone)
      ) {
        return res.status(400).json({
          message: "Phone number must contain 10 digits",
        });
      }

      if (cleanPhone) {
        const existingUser = await User.findOne({
          phone: cleanPhone,
          _id: { $ne: user._id },
        });

        if (existingUser) {
          return res.status(400).json({
            message: "Phone already registered",
          });
        }

        user.phone = cleanPhone;
      } else {
        user.phone = undefined;
      }
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    console.error("updateMe error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Phone already registered",
      });
    }

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};