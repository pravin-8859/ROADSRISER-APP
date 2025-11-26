import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: false },
  phone: { type: String, required: true, unique: true },

  gst: String,
  garageName: String,
  address: String,
  isVerified: { type: Boolean, default: false },

  otpHash: String,
  otpExpire: Date
});

// password hashing
mechanicSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

mechanicSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Mechanic", mechanicSchema);
