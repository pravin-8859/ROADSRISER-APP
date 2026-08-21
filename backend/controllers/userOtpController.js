import bcrypt from "bcrypt";
import User from "../models/User.js";
import OtpVerification from "../models/OtpVerification.js";

import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  generateSecureToken,
  hashToken,
} from "../utils/otp.js";

import { sendEmail } from "../utils/email.js";
import { otpTemplate } from "../utils/emailTamplates.js";


// =====================================================
// CONSTANTS
// =====================================================

const OTP_EXPIRY = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const MAX_ATTEMPTS = 5;


// =====================================================
// SEND SIGNUP OTP
// =====================================================

export const sendSignupOtp = async (req, res) => {
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

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanPhone =
      phone?.trim() || undefined;


    // -------------------------------
    // CHECK EXISTING EMAIL
    // -------------------------------

    const emailExists = await User.findOne({
      email: cleanEmail,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }


    // -------------------------------
    // CHECK PHONE
    // -------------------------------

    if (cleanPhone) {
      if (!/^\d{10}$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Phone number must contain 10 digits",
        });
      }

      const phoneExists = await User.findOne({
        phone: cleanPhone,
      });

      if (phoneExists) {
        return res.status(400).json({
          message: "Phone already registered",
        });
      }
    }


    // -------------------------------
    // RESEND COOLDOWN
    // -------------------------------

    const existingOtp =
      await OtpVerification.findOne({
        email: cleanEmail,
        purpose: "signup",
      });

    if (existingOtp) {
      const timePassed =
        Date.now() -
        new Date(existingOtp.lastSentAt).getTime();

      if (timePassed < RESEND_COOLDOWN) {
        const remaining = Math.ceil(
          (RESEND_COOLDOWN - timePassed) / 1000
        );

        return res.status(429).json({
          message: `Please wait ${remaining} seconds before requesting another OTP`,
        });
      }
    }


    // -------------------------------
    // GENERATE OTP
    // -------------------------------

    const otp = generateOtp();

    const otpHashValue = hashOtp(otp);

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // -------------------------------
    // SAVE OTP
    // -------------------------------

    await OtpVerification.findOneAndUpdate(
      {
        email: cleanEmail,
        purpose: "signup",
      },
      {
        email: cleanEmail,
        purpose: "signup",

        otpHash: otpHashValue,

        signupData: {
          name: name.trim(),
          phone: cleanPhone,
          password: hashedPassword,
        },

        attempts: 0,
        lastSentAt: new Date(),

        expiresAt: new Date(
          Date.now() + OTP_EXPIRY
        ),

        verifiedAt: null,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );


    // -------------------------------
    // SEND EMAIL
    // -------------------------------

    const emailSent = await sendEmail({
      to: cleanEmail,

      subject:
        "RoadsRiser - Verify Your Account",

      html: otpTemplate({
        otp,
        purpose: "signup",
      }),
    });


    if (!emailSent) {
      await OtpVerification.deleteOne({
        email: cleanEmail,
        purpose: "signup",
      });

      return res.status(500).json({
        message:
          "Unable to send verification email. Please try again.",
      });
    }


    return res.json({
      success: true,
      message:
        "Verification OTP sent to your email",
    });

  } catch (error) {
    console.error(
      "sendSignupOtp error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to send verification OTP",
    });
  }
};


// =====================================================
// VERIFY SIGNUP OTP
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

    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({
        message:
          "Email and OTP are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const verification =
      await OtpVerification.findOne({
        email: cleanEmail,
        purpose: "signup",
      });

    if (!verification) {
      return res.status(400).json({
        message:
          "OTP expired or verification request not found",
      });
    }

    if (
      new Date() >
      new Date(verification.expiresAt)
    ) {
      await verification.deleteOne();

      return res.status(400).json({
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    if (
      verification.attempts >= MAX_ATTEMPTS
    ) {
      await verification.deleteOne();

      return res.status(429).json({
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }


    // -------------------------------
    // VERIFY OTP
    // -------------------------------

    const validOtp = verifyOtpHash(
      otp.trim(),
      verification.otpHash
    );

    if (!validOtp) {
      verification.attempts += 1;

      await verification.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }


    // -------------------------------
    // FINAL DUPLICATE CHECK
    // -------------------------------

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      await verification.deleteOne();

      return res.status(400).json({
        message:
          "Email already registered",
      });
    }


    if (verification.signupData?.phone) {
      const existingPhone =
        await User.findOne({
          phone:
            verification.signupData.phone,
        });

      if (existingPhone) {
        await verification.deleteOne();

        return res.status(400).json({
          message:
            "Phone already registered",
        });
      }
    }


    // -------------------------------
    // CREATE USER
    // -------------------------------

    const user = await User.create({
      name:
        verification.signupData.name,

      email: cleanEmail,

      phone:
        verification.signupData.phone,

      password:
        verification.signupData.password,

      emailVerified: true,
    });


    // -------------------------------
    // DELETE OTP
    // -------------------------------

    await verification.deleteOne();


    return res.status(201).json({
      success: true,
      message:
        "Email verified and account created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });

  } catch (error) {
    console.error(
      "verifySignupOtp error:",
      error
    );

    return res.status(500).json({
      message:
        "Account verification failed",
    });
  }
};


// =====================================================
// SEND PASSWORD RESET OTP
// =====================================================

export const sendPasswordResetOtp = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();


    const user = await User.findOne({
      email: cleanEmail,
    });


    // IMPORTANT:
    // Same response whether user exists or not.
    // This prevents email enumeration.

    if (!user) {
      return res.json({
        success: true,
        message:
          "If this email is registered, a reset OTP has been sent.",
      });
    }


    // -------------------------------
    // COOLDOWN
    // -------------------------------

    const existingOtp =
      await OtpVerification.findOne({
        email: cleanEmail,
        purpose: "password_reset",
      });

    if (existingOtp) {
      const timePassed =
        Date.now() -
        new Date(existingOtp.lastSentAt).getTime();

      if (timePassed < RESEND_COOLDOWN) {
        const remaining = Math.ceil(
          (RESEND_COOLDOWN - timePassed) / 1000
        );

        return res.status(429).json({
          message: `Please wait ${remaining} seconds before requesting another OTP`,
        });
      }
    }


    const otp = generateOtp();

    const otpHashValue = hashOtp(otp);


    await OtpVerification.findOneAndUpdate(
      {
        email: cleanEmail,
        purpose: "password_reset",
      },
      {
        email: cleanEmail,
        purpose: "password_reset",

        otpHash: otpHashValue,

        attempts: 0,

        lastSentAt: new Date(),

        expiresAt: new Date(
          Date.now() + OTP_EXPIRY
        ),

        verifiedAt: null,

        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );


    const emailSent = await sendEmail({
      to: cleanEmail,

      subject:
        "RoadsRiser - Password Reset OTP",

      html: otpTemplate({
        otp,
        purpose: "password_reset",
      }),
    });


    if (!emailSent) {
      await OtpVerification.deleteOne({
        email: cleanEmail,
        purpose: "password_reset",
      });

      return res.status(500).json({
        message:
          "Unable to send reset email. Please try again.",
      });
    }


    return res.json({
      success: true,
      message:
        "If this email is registered, a reset OTP has been sent.",
    });

  } catch (error) {
    console.error(
      "sendPasswordResetOtp error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process password reset request",
    });
  }
};


// =====================================================
// VERIFY PASSWORD RESET OTP
// =====================================================

export const verifyPasswordResetOtp = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({
        message:
          "Email and OTP are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const verification =
      await OtpVerification.findOne({
        email: cleanEmail,
        purpose: "password_reset",
      });

    if (!verification) {
      return res.status(400).json({
        message:
          "OTP expired or verification request not found",
      });
    }

    if (
      new Date() >
      new Date(verification.expiresAt)
    ) {
      await verification.deleteOne();

      return res.status(400).json({
        message:
          "OTP expired. Please request a new OTP.",
      });
    }

    if (
      verification.attempts >= MAX_ATTEMPTS
    ) {
      await verification.deleteOne();

      return res.status(429).json({
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }


    const validOtp = verifyOtpHash(
      otp.trim(),
      verification.otpHash
    );

    if (!validOtp) {
      verification.attempts += 1;

      await verification.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }


    const resetToken =
      generateSecureToken();

    verification.verifiedAt = new Date();

    verification.resetTokenHash =
      hashToken(resetToken);

    verification.resetTokenExpiresAt =
      new Date(
        Date.now() + 10 * 60 * 1000
      );

    await verification.save();


    return res.json({
      success: true,
      message: "OTP verified successfully",

      resetToken,
    });

  } catch (error) {
    console.error(
      "verifyPasswordResetOtp error:",
      error
    );

    return res.status(500).json({
      message:
        "OTP verification failed",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      resetToken,
      password,
    } = req.body;

    if (
      !email?.trim() ||
      !resetToken?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email, reset token and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const verification =
      await OtpVerification.findOne({
        email: cleanEmail,
        purpose: "password_reset",
      });

    if (!verification) {
      return res.status(400).json({
        message:
          "Password reset session expired",
      });
    }

    if (
      !verification.verifiedAt ||
      !verification.resetTokenHash ||
      !verification.resetTokenExpiresAt
    ) {
      return res.status(400).json({
        message:
          "Please verify the OTP first",
      });
    }

    if (
      new Date() >
      new Date(
        verification.resetTokenExpiresAt
      )
    ) {
      await verification.deleteOne();

      return res.status(400).json({
        message:
          "Password reset session expired",
      });
    }


    const validToken =
      hashToken(resetToken) ===
      verification.resetTokenHash;

    if (!validToken) {
      return res.status(400).json({
        message:
          "Invalid password reset session",
      });
    }


    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      await verification.deleteOne();

      return res.status(404).json({
        message: "User not found",
      });
    }


    user.password =
      await bcrypt.hash(password, 10);

    // Revoke existing refresh token.
    // User must login again after password reset.
    user.refreshToken = null;

    await user.save();


    await verification.deleteOne();


    return res.json({
      success: true,
      message:
        "Password reset successfully. Please login again.",
    });

  } catch (error) {
    console.error(
      "resetPassword error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to reset password",
    });
  }
};