import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const {
      customerId,
      currentPassword,
      newPassword,
    } = await request.json();

    if (
      !customerId ||
      !currentPassword ||
      !newPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    // Find customer

    const { data: customer, error } =
      await supabaseAdmin
        .from("customers")
        .select("id,password")
        .eq("id", customerId)
        .single();

    if (error || !customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found.",
        },
        { status: 404 }
      );
    }

    // Verify current password

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        customer.password
      );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 401 }
      );
    }

    // Hash new password

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Update password

    const { error: updateError } =
      await supabaseAdmin
        .from("customers")
        .update({
          password: hashedPassword,
        })
        .eq("id", customerId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message:
        "Password updated successfully.",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to change password.",
      },
      {
        status: 500,
      }
    );
  }
}