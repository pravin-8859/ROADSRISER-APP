import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true }, // ✔ FIX
  phone: { type: String, unique: true, required: true },
  password: { type: String },
  gst: String,
  garageName: String,
  address: String,
  isVerified: { type: Boolean, default: false },

  // OTP fields
  otpHash: String,
  otpExpire: Date,
  otpPurpose: String,

  refreshToken: String
}, { timestamps: true });

mechanicSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Mechanic", mechanicSchema);
