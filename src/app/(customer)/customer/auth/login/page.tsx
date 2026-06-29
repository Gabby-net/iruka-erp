"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/customer-app/Logo";
import TextInput from "@/components/customer-app/TextInput";
import { useCustomer } from "@/context/CustomerContext";

export default function LoginPage() {
  const router = useRouter();
  const { customer, login } = useCustomer();
  useEffect(() => {
  if (customer) {
    router.replace("/customer/home");
  }
}, [customer, router]);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!phone || !password) {
      alert("Please enter your phone number and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      console.log("CUSTOMER:", data.customer);
      login(data.customer);

      alert("Login successful!");

      router.push("/customer/home");

    } catch (error) {
      console.error(error);
      alert("Unable to login.");
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
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500">
            Login to continue ordering fresh bread.
          </p>

          <div className="mt-8">

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
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-8 bg-[#071028] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <button
            onClick={() => router.push("/customer/auth/register")}
            className="w-full mt-4 text-[#B45309] font-bold"
          >
            Create New Account
          </button>

        </div>

      </div>

    </main>
  );
}