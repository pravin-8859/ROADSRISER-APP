import crypto from "crypto";
import Mechanic from "../models/Mechanic.js";

import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
} from "../utils/otp.js";

import { sendEmail } from "../utils/email.js";
import { otpTemplate } from "../utils/emailTamplates.js";

// =====================================================
// RESET TOKEN HELPERS
// =====================================================

const hashResetToken = (token) =>
  crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

const generateResetToken = () =>
  crypto.randomBytes(32).toString("hex");

// =====================================================
// SEND RESET OTP
// =====================================================

export const sendMechanicResetOtp = async (req, res) => {
  try {
    const email = req.body?.email
      ?.trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const mechanic = await Mechanic.findOne({
      email,
    });

    // Do not reveal whether account exists
    if (!mechanic || !mechanic.isVerified) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, an OTP has been sent.",
      });
    }

    const otp = generateOtp(6);
    const hashedOtp = hashOtp(otp);

    mechanic.resetOtpHash = hashedOtp;
    mechanic.resetOtpExpire =
      new Date(Date.now() + 5 * 60 * 1000);

    mechanic.resetOtpAttempts = 0;

    // Invalidate any previous reset token
    mechanic.resetTokenHash = null;
    mechanic.resetTokenExpire = null;

    await mechanic.save();

    const sent = await sendEmail({
  to: mechanic.email,
  subject:
    "RoadsRiser - Mechanic Password Reset OTP",
  html: otpTemplate({
    otp,
    purpose: "password_reset",
  }),
});

    if (!sent) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;
      mechanic.resetOtpAttempts = 0;

      await mechanic.save();

      return res.status(500).json({
        success: false,
        message:
          "Unable to send OTP. Please try again.",
      });
    }

    return res.json({
      success: true,
      message:
        "If an account exists with this email, an OTP has been sent.",
    });
  } catch (err) {
    console.error(
      "sendMechanicResetOtp error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send reset OTP",
    });
  }
};

// =====================================================
// VERIFY RESET OTP
// =====================================================

export const verifyMechanicResetOtp = async (
  req,
  res
) => {
  try {
    const email = req.body?.email
      ?.trim()
      .toLowerCase();

    const otp = req.body?.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const mechanic = await Mechanic.findOne({
      email,
    });

    if (
      !mechanic ||
      !mechanic.resetOtpHash ||
      !mechanic.resetOtpExpire
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (
      mechanic.resetOtpExpire.getTime() <=
      Date.now()
    ) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;
      mechanic.resetOtpAttempts = 0;

      await mechanic.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Maximum 5 wrong attempts
    if (mechanic.resetOtpAttempts >= 5) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;
      mechanic.resetOtpAttempts = 0;

      await mechanic.save();

      return res.status(429).json({
        success: false,
        message:
          "Too many invalid OTP attempts. Please request a new OTP.",
      });
    }

    const valid = verifyOtpHash(
      otp,
      mechanic.resetOtpHash
    );

    if (!valid) {
      mechanic.resetOtpAttempts += 1;

      if (mechanic.resetOtpAttempts >= 5) {
        mechanic.resetOtpHash = null;
        mechanic.resetOtpExpire = null;
        mechanic.resetOtpAttempts = 0;

        await mechanic.save();

        return res.status(429).json({
          success: false,
          message:
            "Too many invalid OTP attempts. Please request a new OTP.",
        });
      }

      await mechanic.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate cryptographically secure reset token
    const resetToken = generateResetToken();

    mechanic.resetTokenHash =
      hashResetToken(resetToken);

    mechanic.resetTokenExpire =
      new Date(Date.now() + 10 * 60 * 1000);

    // OTP is now consumed
    mechanic.resetOtpHash = null;
    mechanic.resetOtpExpire = null;
    mechanic.resetOtpAttempts = 0;

    await mechanic.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (err) {
    console.error(
      "verifyMechanicResetOtp error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetMechanicPassword = async (
  req,
  res
) => {
  try {
    const email = req.body?.email
      ?.trim()
      .toLowerCase();

    const resetToken =
      req.body?.resetToken?.trim();

    const password = req.body?.password;

    if (!email || !resetToken || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email, reset token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (resetToken.length !== 64) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const mechanic = await Mechanic.findOne({
      email,
    });

    if (
      !mechanic ||
      !mechanic.resetTokenHash ||
      !mechanic.resetTokenExpire
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token",
      });
    }

    if (
      mechanic.resetTokenExpire.getTime() <=
      Date.now()
    ) {
      mechanic.resetTokenHash = null;
      mechanic.resetTokenExpire = null;

      await mechanic.save();

      return res.status(400).json({
        success: false,
        message:
          "Reset token has expired",
      });
    }

    const tokenHash =
      hashResetToken(resetToken);

    const valid =
      crypto.timingSafeEqual(
        Buffer.from(tokenHash, "hex"),
        Buffer.from(
          mechanic.resetTokenHash,
          "hex"
        )
      );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token",
      });
    }

    // Password will be bcrypt-hashed by Mechanic pre-save hook
    mechanic.password = password;

    // Consume reset token immediately
    mechanic.resetTokenHash = null;
    mechanic.resetTokenExpire = null;

    // Invalidate existing persistent login session
    mechanic.refreshToken = null;

    // Make mechanic offline after password reset
    mechanic.isOnline = false;
    mechanic.activeRequest = null;

    await mechanic.save();

    return res.json({
      success: true,
      message:
        "Password reset successfully. Please login again.",
    });
  } catch (err) {
    console.error(
      "resetMechanicPassword error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password",
    });
  }
};