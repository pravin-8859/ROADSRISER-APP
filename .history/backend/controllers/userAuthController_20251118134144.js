export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // or "1234"
    console.log("USER DEBUG OTP:", otp);

    // TEMP STORE
    otpStore[phone] = otp;

    return res.json({
      message: "OTP sent (debug mode)",
      otp, // frontend easier for now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
