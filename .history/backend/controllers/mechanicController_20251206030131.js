export const mechanicSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone: rawPhone,
      gst,
      garageName,
      address,
      otp,
    } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP required" });

    const phone = normalizePhone(rawPhone);
    const cleanEmail = email?.toLowerCase().trim();

    let mechRecord = null;

    // -------------------------------
    // 1️⃣ Email-Based Signup (OTP sent to email)
    // -------------------------------
    if (cleanEmail) {
      mechRecord = await Mechanic.findOne({ email: cleanEmail });
    }

    // -------------------------------
    // 2️⃣ Phone-Based Signup
    // -------------------------------
    if (!mechRecord && phone) {
      mechRecord = await Mechanic.findOne({ phone });
    }

    if (!mechRecord)
      return res.status(400).json({ message: "No OTP sent for this email/phone" });

    if (!mechRecord.otpHash)
      return res.status(400).json({ message: "OTP not found" });

    if (new Date() > mechRecord.otpExpire)
      return res.status(400).json({ message: "OTP expired" });

    // -------------------------------
    // OTP Verify
    // -------------------------------
    const ok = await verifyOtpHash(otp, mechRecord.otpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // -------------------------------
    // Continue registration
    // -------------------------------
    mechRecord.name = name;
    mechRecord.email = cleanEmail;
    mechRecord.phone = phone;
    mechRecord.password = password;
    mechRecord.gst = gst;
    mechRecord.garageName = garageName;
    mechRecord.address = address;
    mechRecord.isVerified = true;

    mechRecord.otpHash = undefined;
    mechRecord.otpExpire = undefined;

    await mechRecord.save();

    return res.json({
      message: "Registered successfully",
      mechanicId: mechRecord._id,
    });

  } catch (err) {
    console.error("mechanicSignup error:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Duplicate field error" });
    return res.status(500).json({ message: "Signup failed" });
  }
};
