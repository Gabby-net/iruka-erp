import { NextResponse } from "next/server";

const TERMII_API_KEY = process.env.TERMII_API_KEY!;
const TERMII_BASE_URL = process.env.TERMII_BASE_URL!;

export async function POST(request: Request) {
  try {
    const { pinId, code } = await request.json();

    if (!pinId || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${TERMII_BASE_URL}/api/sms/otp/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: TERMII_API_KEY,
          pin_id: pinId,
          pin: code,
        }),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      { status: 500 }
    );
  }
}