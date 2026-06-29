import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { fullName, phone, password } = await request.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number already registered",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert({
        full_name: fullName,
        phone,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      console.log("SUPABASE ERROR:");
      console.log(error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      customer: data,
    });
  } catch (error) {
    console.error("CREATE CUSTOMER ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create customer",
        error,
      },
      { status: 500 }
    );
  }
}