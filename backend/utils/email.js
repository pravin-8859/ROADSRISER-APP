import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
    const senderName =
      process.env.BREVO_SENDER_NAME?.trim() || "RoadsRiser";

    if (!apiKey) {
      console.error("❌ BREVO_API_KEY is missing");
      return false;
    }

    if (!senderEmail) {
      console.error("❌ BREVO_SENDER_EMAIL is missing");
      return false;
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: to,
            },
          ],
          subject,
          htmlContent: html,
        }),
      }
    );

    const responseData = await response.text();

    if (!response.ok) {
      console.error("❌ Brevo email error:", {
        status: response.status,
        response: responseData,
      });

      return false;
    }

    console.log("✅ Email sent successfully to:", to);

    return true;
  } catch (error) {
    console.error("❌ Email API error:", error.message);

    return false;
  }
};