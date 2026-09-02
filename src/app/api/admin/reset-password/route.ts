import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const adminUserId = "ec973a6e-c170-43f0-b2cb-f0bd37167644";

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      adminUserId,
      {
        password,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { error: "Unable to reset password." },
      { status: 500 }
    );
  }
}