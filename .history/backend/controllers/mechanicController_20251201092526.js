// controllers/mechanicController.js (update sendOtp)
import Mechanic from "../models/Mechanic.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";

const normalizePhone = (raw) => (raw ? String(raw).replace(/\D/g, "") : "");

export const sendOtp = async (req, res) => {
  try {
    const { phone: rawPhone, email } = req.body;

    const otp = generateOtp(4); // 4-digit
    const otpHash = await hashOtp(otp);
    const expire = Date.now() + 5 * 60 * 1000; // 5 minutes

    let mech;

    if (email && typeof email === "string") {
      // find by email OR create a minimal record keyed by email
      mech = await Mechanic.findOne({ email: email.toLowerCase() });

      if (!mech) {
        mech = new Mechanic({
          email: email.toLowerCase(),
          otpHash,
          otpExpire: expire,
          isVerified: false,
        });
      } else {
        mech.otpHash = otpHash;
        mech.otpExpire = expire;
      }

      await mech.save({ validateBeforeSave: false });

      // Send email
      const mailHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.4">
          <h3>RoadsRiser OTP</h3>
          <p>Your verification code is: <strong style="font-size:20px">${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `;

      // send email (do not expose OTP in production response)
      await sendEmail({
        to: email,
        subject: "Your RoadsRiser verification code",
        html: mailHtml,
      });

      if (process.env.DEBUG_SEND_OTP === "true") {
        return res.json({ success: true, message: "OTP sent to email", debugOtp: otp });
      }
      return res.json({ success: true, message: "OTP sent to email" });
    }

    // Phone path (existing flow)
    const phone = normalizePhone(rawPhone);
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    mech = await Mechanic.findOne({ phone });

    if (!mech) {
      mech = new Mechanic({
        phone,
        otpHash,
        otpExpire: expire,
        isVerified: false,
      });
    } else {
      mech.otpHash = otpHash;
      mech.otpExpire = expire;
    }

    await mech.save({ validateBeforeSave: false });

    // TODO: integrate SMS provider here (e.g., Twilio) for production.
    // For now return debug OTP only when DEBUG_SEND_OTP=true
    console.log("MECHANIC DEBUG OTP:", otp);
    if (process.env.DEBUG_SEND_OTP === "true") {
      return res.json({ success: true, message: "OTP sent to phone", debugOtp: otp });
    }
    return res.json({ success: true, message: "OTP sent to phone" });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "OTP error" });
  }
};
