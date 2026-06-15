import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      password,
      fullName,
      role,
    } = body;

    const {
      data,
      error,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    const { error: userError } =
      await supabaseAdmin
        .from("users")
        .insert([
          {
            email,
            full_name: fullName,
            role,
          },
        ]);

    if (userError) {
      return NextResponse.json(
        {
          error: userError.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}