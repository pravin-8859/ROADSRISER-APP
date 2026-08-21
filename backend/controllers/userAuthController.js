import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PendingUser from "../models/PendingUser.js";

import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
} from "../utils/otp.js";

import { sendEmail } from "../utils/email.js";

import { otpTemplate } from "../utils/emailTamplates.js";

let otpStore = {};

// =====================================================
// SEND OTP
// =====================================================
// =====================================================
// OLD PHONE OTP
// =====================================================

export const sendOtp = async (req, res) => {
  return res.status(410).json({
    message:
      "Phone OTP signup is no longer used. Please use email verification.",
  });
};


// =====================================================
// SEND SIGNUP EMAIL OTP
// =====================================================

export const sendSignupOtp = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // ================= VALIDATION =================

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
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email
      .toLowerCase()
      .trim();

    const cleanPhone =
      phone?.replace(/\D/g, "") || "";


    // ================= EMAIL CHECK =================

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "This email is already registered. Please login.",
      });
    }


    // ================= PHONE CHECK =================

    if (cleanPhone) {
      if (!/^\d{10}$/.test(cleanPhone)) {
        return res.status(400).json({
          message:
            "Phone number must contain 10 digits",
        });
      }

      const phoneExists = await User.findOne({
        phone: cleanPhone,
      });

      if (phoneExists) {
        return res.status(400).json({
          message:
            "This phone number is already registered.",
        });
      }
    }


    // ================= OTP =================

    const otp = generateOtp(6);

    const otpHash = await hashOtp(otp);

    const otpExpire = new Date(
      Date.now() + 5 * 60 * 1000
    );


    // ================= PENDING USER =================

    await PendingUser.findOneAndUpdate(
      {
        email: cleanEmail,
      },
      {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone || undefined,
        password,
        otpHash,
        otpExpire,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );


    // ================= EMAIL =================

    const emailSent = await sendEmail({
      to: cleanEmail,
      subject:
        "RoadsRiser - Verify Your Email",
      html: otpTemplate(otp),
    });


    if (!emailSent) {
      await PendingUser.deleteOne({
        email: cleanEmail,
      });

      return res.status(500).json({
        message:
          "Unable to send verification email. Please try again.",
      });
    }


    console.log(
      "Signup verification email sent to:",
      cleanEmail
    );


    return res.json({
      success: true,
      message:
        "Verification OTP sent to your email.",
    });

  } catch (err) {
    console.error(
      "sendSignupOtp error:",
      err
    );

    return res.status(500).json({
      message:
        "Failed to send verification OTP",
    });
  }
};


// =====================================================
// VERIFY SIGNUP OTP + CREATE USER
// =====================================================

export const verifySignupOtp = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!otp?.trim()) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }


    const cleanEmail = email
      .toLowerCase()
      .trim();


    // ================= FIND PENDING USER =================

    const pendingUser =
      await PendingUser.findOne({
        email: cleanEmail,
      });


    if (!pendingUser) {
      return res.status(400).json({
        message:
          "Verification request not found. Please request a new OTP.",
      });
    }


    // ================= OTP EXPIRY =================

    if (
      !pendingUser.otpExpire ||
      new Date() >
        pendingUser.otpExpire
    ) {
      await PendingUser.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }


    // ================= OTP VERIFY =================

    const isValidOtp =
      await verifyOtpHash(
        otp.trim(),
        pendingUser.otpHash
      );


    if (!isValidOtp) {
      return res.status(400).json({
        message:
          "Invalid OTP. Please check your email and try again.",
      });
    }


    // ================= FINAL DUPLICATE CHECK =================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      await PendingUser.deleteOne({
        _id: pendingUser._id,
      });

      return res.status(400).json({
        message:
          "This email is already registered. Please login.",
      });
    }


    // ================= PHONE DUPLICATE CHECK =================

    if (pendingUser.phone) {
      const phoneExists =
        await User.findOne({
          phone: pendingUser.phone,
        });

      if (phoneExists) {
        return res.status(400).json({
          message:
            "This phone number is already registered.",
        });
      }
    }


    // ================= CREATE USER =================

    const hashedPassword =
      await bcrypt.hash(
        pendingUser.password,
        10
      );


    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone || undefined,
      password: hashedPassword,
      emailVerified: true,
    });


    // ================= REMOVE PENDING =================

    await PendingUser.deleteOne({
      _id: pendingUser._id,
    });


    return res.status(201).json({
      success: true,
      message:
        "Email verified and account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        emailVerified: true,
      },
    });

  } catch (err) {
    console.error(
      "verifySignupOtp error:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to verify OTP and create account.",
    });
  }
};

// =====================================================
// REGISTER
// =====================================================

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

    const emailExists = await User.findOne({
      email: cleanEmail,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

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

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

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

// =====================================================
// LOGIN
// =====================================================

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

    // ================= ACCESS TOKEN =================

    const accessToken = jwt.sign(
      {
        id: String(user._id),
        type: "user",
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // ================= REFRESH TOKEN =================

    const refreshToken = jwt.sign(
      {
        id: String(user._id),
        type: "user",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.refreshToken = refreshToken;

    await user.save();

    // ================= COOKIE =================

    res.cookie("rr_user_refresh", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token: accessToken,
      accessToken,

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

// =====================================================
// REFRESH USER TOKEN
// =====================================================

export const refreshUserToken = async (req, res) => {
  try {
    const token = req.cookies?.rr_user_refresh;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    if (
      !decoded.id ||
      decoded.type !== "user"
    ) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: token,
    });

    if (!user) {
      return res.status(401).json({
        message: "Refresh token is no longer valid",
      });
    }

    const accessToken = jwt.sign(
      {
        id: String(user._id),
        type: "user",
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    console.error(
      "refreshUserToken error:",
      err.message
    );

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.rr_user_refresh;

    if (token) {
      await User.findOneAndUpdate(
        {
          refreshToken: token,
        },
        {
          $unset: {
            refreshToken: "",
          },
        }
      );
    }

    res.clearCookie("rr_user_refresh");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(
      "logoutUser error:",
      err
    );

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

// =====================================================
// GET ME
// =====================================================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password -refreshToken");

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

// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateMe = async (req, res) => {
  try {
    const {
      name,
      phone,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

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
          message:
            "Phone number must contain 10 digits",
        });
      }

      if (cleanPhone) {
        const existingUser =
          await User.findOne({
            phone: cleanPhone,
            _id: {
              $ne: user._id,
            },
          });

        if (existingUser) {
          return res.status(400).json({
            message:
              "Phone already registered",
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
      message:
        "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    console.error(
      "updateMe error:",
      err
    );

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};