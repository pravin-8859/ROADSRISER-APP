import Mechanic from "../models/Mechanic.js";

import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
} from "../utils/otp.js";

import { sendEmail } from "../utils/email.js";

import { otpTemplate } from "../utils/emailTamplates.js";


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

    /*
      Don't reveal whether an email exists.
    */

    if (!mechanic) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, an OTP has been sent.",
      });
    }

    if (!mechanic.isVerified) {
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

    await mechanic.save();

    const sent = await sendEmail({
      to: mechanic.email,

      subject:
        "RoadsRiser - Mechanic Password Reset OTP",

      html: otpTemplate(otp),
    });

    if (!sent) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;

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
        message:
          "Email and OTP are required",
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
      mechanic.resetOtpExpire.getTime() <
      Date.now()
    ) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;

      await mechanic.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const valid = verifyOtpHash(
      otp,
      mechanic.resetOtpHash
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.error(
      "verifyMechanicResetOtp error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "OTP verification failed",
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

    const otp = req.body?.otp?.trim();

    const password = req.body?.password;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
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
      mechanic.resetOtpExpire.getTime() <
      Date.now()
    ) {
      mechanic.resetOtpHash = null;
      mechanic.resetOtpExpire = null;

      await mechanic.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const valid = verifyOtpHash(
      otp,
      mechanic.resetOtpHash
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    /*
      Password is NOT manually hashed here.

      Mechanic model's pre-save hook will hash it.
    */

    mechanic.password = password;

    // OTP becomes unusable immediately
    mechanic.resetOtpHash = null;
    mechanic.resetOtpExpire = null;

    // Logout existing persistent sessions
    mechanic.refreshToken = null;

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