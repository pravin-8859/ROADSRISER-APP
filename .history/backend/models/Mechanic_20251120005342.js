import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mechanicSchema = new mongoose.Schema(
  {
    // basic info (required during full signup)
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    phone: { type: String, unique: true, required: true },

    gst: { type: String },
    garageName: { type: String },
    address: { type: String },
    location: {
      type: String,
      default: "",
    },

    // OTP FIELDS (for send-otp step)
    otpHash: String,
    otpExpire: Date,
    otpPurpose: String,

    // Refresh token
    refreshToken: String,

    // Flags
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// PASSWORD HASHING BEFORE SAVE
mechanicSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// MATCH PASSWORD
mechanicSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

export default mongoose.model("Mechanic", mechanicSchema);
