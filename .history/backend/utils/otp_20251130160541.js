import crypto from "crypto";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function verifyOtpHash(otp, hashed) {
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return hash === hashed;
}
