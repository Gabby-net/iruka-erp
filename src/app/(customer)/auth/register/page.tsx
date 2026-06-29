"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/customer-app/Logo";
import TextInput from "@/components/customer-app/TextInput";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!fullName || !phone || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/create-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Account created successfully!");

      router.push("/customer/welcome");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-10">
      <div className="max-w-md mx-auto">
        <Logo size={90} />

        <div className="mt-10 bg-white rounded-3xl shadow-lg p-6">
          <h1 className="text-3xl font-black text-[#071028]">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Register with your phone number to start ordering fresh bread.
          </p>

          <div className="mt-8">
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <TextInput
              label="Phone Number"
              placeholder="08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-8 bg-[#071028] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
}