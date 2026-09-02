import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  try {
    const adminUserId = "ec973a6e-c170-43f0-b2cb-f0bd37167644";

    const { data, error } =
      await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
        email: "admin@irukaajah.com",
        email_confirm: true,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.user.id,
      email: data.user.email,
    });
  } catch (error) {
    console.error("Update admin email error:", error);

    return NextResponse.json(
      { error: "Unable to update admin email." },
      { status: 500 }
    );
  }
}