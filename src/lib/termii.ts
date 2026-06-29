const TERMII_API_KEY = process.env.TERMII_API_KEY!;
const TERMII_BASE_URL = process.env.TERMII_BASE_URL!;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID!;

export async function sendOTP(phone: string) {
  const response = await fetch(`${TERMII_BASE_URL}/api/sms/otp/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: TERMII_API_KEY,
      message_type: "NUMERIC",
      to: phone,
      from: TERMII_SENDER_ID,
      channel: "generic",
      pin_attempts: 3,
      pin_time_to_live: 10,
      pin_length: 6,
      pin_placeholder: "<1234>",
      message_text:
        "Your IRUKA BREAD verification code is <1234>. It expires in 10 minutes.",
    }),
  });

  console.log("HTTP STATUS:", response.status);
  console.log("HTTP OK:", response.ok);

  const text = await response.text();
  console.log("RAW RESPONSE:", text);

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}