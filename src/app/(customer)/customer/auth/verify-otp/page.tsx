"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/customer-app/Logo";

export default function VerifyOTPPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerifyOTP() {
    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    const pendingRegistration = sessionStorage.getItem("pendingRegistration");

    if (!pendingRegistration) {
      alert("Registration session expired.");
      router.push("/customer/auth/register");
      return;
    }

    const registration = JSON.parse(pendingRegistration);

    try {
      setLoading(true);

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinId: registration.pinId,
          code: otp,
        }),
      });

      const result = await response.json();

      console.log(result);

      // Customer creation in Supabase comes next
      const createCustomer = await fetch("/api/auth/create-customer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullName: registration.fullName,
    phone: registration.phone,
    password: registration.password,
  }),
});

const customer = await createCustomer.json();

if (!createCustomer.ok) {
  alert(customer.message);
  return;
}

alert("Account created successfully!");

router.push("/customer/welcome");

    } catch (error) {
      console.error(error);
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-10 flex items-center">
      <div className="max-w-md mx-auto w-full">

        <div className="flex justify-center mb-8">
          <Logo size={80} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h1 className="text-3xl font-black text-[#071028] text-center">
            Verify OTP
          </h1>

          <p className="mt-3 text-center text-gray-500">
            Enter the 6-digit verification code sent to your phone.
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="------"
            className="w-full mt-10 border-2 border-gray-200 rounded-2xl py-4 text-center text-3xl font-bold tracking-[14px] outline-none focus:border-[#071028]"
          />

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full mt-8 bg-[#071028] hover:bg-black text-white py-4 rounded-2xl font-bold transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            className="w-full mt-4 text-[#071028] font-semibold"
          >
            Resend Code
          </button>

        </div>

      </div>
    </main>
  );
}