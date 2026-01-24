export const otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#4F46E5;">🔐 Your RoadsRiser OTP</h2>
    <p>Use the following OTP to verify your account:</p>

    <div style="
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 4px;
      background:#f3f4f6;
      padding: 12px 20px;
      border-radius: 10px;
      display: inline-block;
      margin: 10px 0;
    ">
      ${otp}
    </div>

    <p style="color:#6b7280;">This OTP is valid for 5 minutes.</p>

    <p style="margin-top:20px;">If you didn’t request this, please ignore this email.</p>

    <br/>
    <strong>- RoadsRiser Team</strong>
  </div>
`;
