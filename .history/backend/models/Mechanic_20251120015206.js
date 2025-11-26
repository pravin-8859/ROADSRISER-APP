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
  otpExpire: Date,
});


mechanicSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Mechanic", mechanicSchema);
