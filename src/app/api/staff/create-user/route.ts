import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      staffId,
      fullName,
      email,
      password,
      role,
    } = await request.json();

    if (
      !staffId ||
      !fullName ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    /* ==========================================
       CREATE AUTH USER
    ========================================== */

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    /* ==========================================
       CREATE USERS TABLE RECORD
    ========================================== */

    const { error: userError } =
      await supabaseAdmin
        .from("users")
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email,
          role,
        });

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    /* ==========================================
       UPDATE STAFF TABLE
    ========================================== */

    const { error: staffError } =
      await supabaseAdmin
        .from("staff")
        .update({
          erp_user: true,
          erp_role: role,
          erp_email: email,
          auth_user_id: authData.user.id,
        })
        .eq("staff_id", staffId);

    if (staffError) {
      return NextResponse.json(
        { error: staffError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ERP account created successfully.",
    });

  } catch (error) {

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );

  }
}