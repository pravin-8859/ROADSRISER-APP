import crypto from "crypto";

// =====================================================
// GENERATE OTP
// =====================================================

export function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  return String(
    Math.floor(
      min + Math.random() * (max - min + 1)
    )
  );
}


// =====================================================
// HASH OTP
// =====================================================

export function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}


// =====================================================
// VERIFY OTP
// =====================================================

export function verifyOtpHash(otp, hashed) {
  const hash = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  return hash === hashed;
}


// =====================================================
// GENERATE SECURE RESET TOKEN
// =====================================================

export function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}


// =====================================================
// HASH RESET TOKEN
// =====================================================

export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");
}