import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// PASSWORD HASH
// =====================================================

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

// =====================================================
// PASSWORD CHECK
// =====================================================

adminSchema.methods.matchPassword = async function (
  enteredPassword
) {
  if (!enteredPassword || !this.password) {
    return false;
  }

  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

export default mongoose.model(
  "Admin",
  adminSchema
);