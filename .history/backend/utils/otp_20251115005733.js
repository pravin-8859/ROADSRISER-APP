import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export function generateOtp(digits = 6) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function hashOtp(otp) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

export async function verifyOtpHash(otp, hash) {
  return bcrypt.compare(otp, hash);
}
