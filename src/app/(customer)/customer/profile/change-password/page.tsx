"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Save,
} from "lucide-react";

import { useCustomer } from "@/context/CustomerContext";

export default function ChangePasswordPage() {

  const router = useRouter();

  const { customer } = useCustomer();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  return (

    <main className="min-h-screen bg-[#F5F7FA]">

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >

            <ArrowLeft className="text-white"/>

          </button>

          <h1 className="text-white text-3xl font-black">

            Change Password

          </h1>

        </div>

      </div>

      <div className="p-5">

        <div className="bg-white rounded-3xl shadow p-6">

          <div className="mb-5">

            <label className="font-bold">

              Current Password

            </label>

            <div className="mt-2 flex items-center gap-3 border rounded-2xl px-4 py-4">

              <Lock className="text-[#B45309]" />

              <input
                type="password"
                value={currentPassword}
                onChange={(e)=>setCurrentPassword(e.target.value)}
                className="flex-1 outline-none"
              />

            </div>

          </div>

          <div className="mb-5">

            <label className="font-bold">

              New Password

            </label>

            <div className="mt-2 flex items-center gap-3 border rounded-2xl px-4 py-4">

              <Lock className="text-[#B45309]" />

              <input
                type="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className="flex-1 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="font-bold">

              Confirm Password

            </label>

            <div className="mt-2 flex items-center gap-3 border rounded-2xl px-4 py-4">

              <Lock className="text-[#B45309]" />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className="flex-1 outline-none"
              />

            </div>

          </div>
                    <button
            onClick={async () => {

              if (!customer) return;

              if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              ) {
                alert("Please fill all fields.");
                return;
              }

              if (newPassword !== confirmPassword) {
                alert("Passwords do not match.");
                return;
              }

              if (newPassword.length < 6) {
                alert("Password must be at least 6 characters.");
                return;
              }

              try {

                setSaving(true);

const response = await fetch(
  "/api/auth/change-password",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId: customer.id,
      currentPassword,
      newPassword,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  alert(result.message);
  return;
}

alert(result.message);

router.push("/customer/profile");
} catch (error) {

  console.error(error);

  alert("Unable to change password.");

} finally {

  setSaving(false);

}

            }}
            disabled={saving}
            className="w-full mt-8 bg-[#071028] text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-bold disabled:opacity-50"
          >

            <Save size={20} />

            {saving
              ? "Updating..."
              : "Change Password"}

          </button>

        </div>

      </div>

    </main>

  );

}