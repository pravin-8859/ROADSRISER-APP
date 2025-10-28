import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  shopName: { type: String },
  location: { type: String, required: true },
  gstNumber: { type: String },
  specialization: { type: String },
  services: [{ type: String }],
  experience: { type: Number },
  profilePic: { type: String },
  adminApproved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Mechanic", mechanicSchema);
