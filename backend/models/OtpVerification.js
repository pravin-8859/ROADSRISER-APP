import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ["signup", "password_reset"],
      required: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    // Signup data is temporarily stored here.
    // Password is already hashed before storing.
    signupData: {
      name: String,
      phone: String,
      password: String,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lastSentAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    resetTokenHash: {
      type: String,
      default: null,
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB automatically removes expired OTP documents.
otpVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);