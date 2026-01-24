import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true, lowercase: true },
  password: { type: String, required: false },
  phone: { type: String, required: true, unique: true, trim: true },

  gst: { type: String },
  garageName: { type: String },
  address: { type: String },
  isVerified: { type: Boolean, default: false },

  otpHash: { type: String },
  otpExpire: { type: Date },

  // refreshToken is used in controller/login flow
  refreshToken: { type: String },
}, { timestamps: true });

// Create a unique sparse index for email so NULL/missing emails won't conflict
mechanicSchema.index({ email: 1 }, { unique: true, sparse: true });

// password hashing — only when password is present and modified
mechanicSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || !this.password) return next();
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

// compare password safely
mechanicSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Mechanic", mechanicSchema);
