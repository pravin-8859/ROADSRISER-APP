import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    gst: {
      type: String,
      trim: true,
      uppercase: true,
    },

    garageName: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // Mechanic profile photo
    profilePhoto: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otpHash: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    // Refresh token for authentication
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Unique email index.
// sparse = documents without email won't conflict.
mechanicSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// Hash password only when it is created/changed.
mechanicSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || !this.password) {
      return next();
    }

    const saltRounds = 10;

    this.password = await bcrypt.hash(
      this.password,
      saltRounds
    );

    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with hashed password.
mechanicSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!this.password || !enteredPassword) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

export default mongoose.model(
  "Mechanic",
  mechanicSchema
);