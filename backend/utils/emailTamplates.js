export const otpTemplate = ({
  otp,
  purpose = "signup",
}) => {
  const title =
    purpose === "password_reset"
      ? "Reset Your RoadsRiser Password"
      : "Verify Your RoadsRiser Account";

  const message =
    purpose === "password_reset"
      ? "Use the OTP below to reset your RoadsRiser password."
      : "Use the OTP below to verify your RoadsRiser account.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>RoadsRiser</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
  "
>

  <!-- OUTER WRAPPER -->

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#f3f4f6;
      padding:35px 15px;
    "
  >
    <tr>
      <td align="center">

        <!-- MAIN CARD -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #e5e7eb;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->

          <tr>
            <td
              align="center"
              style="
                background:linear-gradient(
                  135deg,
                  #4f46e5,
                  #2563eb
                );
                padding:32px 25px;
              "
            >

              <div
                style="
                  color:#ffffff;
                  font-size:29px;
                  font-weight:800;
                  letter-spacing:-0.5px;
                "
              >
                Roads<span style="color:#bfdbfe;">Riser</span>
              </div>

              <div
                style="
                  margin-top:8px;
                  color:#dbeafe;
                  font-size:11px;
                  font-weight:600;
                  letter-spacing:2px;
                "
              >
                ROADSIDE ASSISTANCE
              </div>

            </td>
          </tr>


          <!-- CONTENT -->

          <tr>
            <td
              style="
                padding:38px 35px;
              "
            >

              <!-- ICON -->

              <div
                style="
                  width:56px;
                  height:56px;
                  line-height:56px;
                  text-align:center;
                  background:#eef2ff;
                  border-radius:15px;
                  font-size:25px;
                  margin-bottom:20px;
                "
              >
                ${purpose === "password_reset" ? "🔑" : "🔐"}
              </div>


              <!-- TITLE -->

              <h2
                style="
                  margin:0;
                  color:#111827;
                  font-size:25px;
                  line-height:34px;
                  font-weight:800;
                "
              >
                ${title}
              </h2>


              <!-- MESSAGE -->

              <p
                style="
                  margin:12px 0 0;
                  color:#4b5563;
                  font-size:15px;
                  line-height:24px;
                "
              >
                ${message}
              </p>


              <!-- OTP LABEL -->

              <p
                style="
                  margin:28px 0 10px;
                  color:#6b7280;
                  font-size:12px;
                  font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1.5px;
                "
              >
                Verification Code
              </p>


              <!-- OTP BOX -->

              <div
                style="
                  background:#f8fafc;
                  border:1px solid #e5e7eb;
                  border-radius:14px;
                  padding:20px 15px;
                  text-align:center;
                "
              >

                <span
                  style="
                    color:#4338ca;
                    font-size:34px;
                    font-weight:800;
                    letter-spacing:8px;
                    line-height:40px;
                  "
                >
                  ${otp}
                </span>

              </div>


              <!-- VALIDITY -->

              <p
                style="
                  margin:22px 0 0;
                  color:#6b7280;
                  font-size:14px;
                  line-height:22px;
                "
              >
                This OTP is valid for
                <strong style="color:#374151;">
                  5 minutes
                </strong>.
                Please do not share this code with anyone.
              </p>


              <!-- SECURITY BOX -->

              <div
                style="
                  margin-top:22px;
                  padding:15px 16px;
                  background:#eff6ff;
                  border:1px solid #dbeafe;
                  border-radius:12px;
                  color:#1e40af;
                  font-size:13px;
                  line-height:20px;
                "
              >

                <strong>Security Notice</strong>

                <br />

                RoadsRiser will never ask you to
                share your OTP with anyone.

              </div>


              <!-- UNKNOWN REQUEST -->

              <p
                style="
                  margin:24px 0 0;
                  color:#9ca3af;
                  font-size:13px;
                  line-height:20px;
                "
              >
                If you did not request this,
                you can safely ignore this email.
              </p>

            </td>
          </tr>


          <!-- FOOTER -->

          <tr>
            <td
              align="center"
              style="
                padding:20px 25px;
                background:#f9fafb;
                border-top:1px solid #e5e7eb;
              "
            >

              <p
                style="
                  margin:0;
                  color:#6b7280;
                  font-size:12px;
                  line-height:20px;
                "
              >
                © ${new Date().getFullYear()}
                RoadsRiser — All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};