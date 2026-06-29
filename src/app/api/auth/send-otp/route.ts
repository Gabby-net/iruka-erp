import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/termii";

export async function POST(request: Request) {

    const { phone } = await request.json();
    if (!phone) {
  return NextResponse.json(
    {
      success: false,
      message: "Phone number is required",
    },
    { status: 400 }
  );
}

const result = await sendOTP(phone);

return NextResponse.json({
  success: true,
  data: result,
});

}