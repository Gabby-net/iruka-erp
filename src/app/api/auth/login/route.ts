import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and password are required",
        },
        { status: 400 }
      );
    }

    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number or password",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}