"use client";

import Image from "next/image";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {

    try {

      setLoading(true);

      /* LOGIN */

      const { error } =
        await supabase.auth.signInWithPassword({

          email,

          password,

        });

      if (error) {

  console.error("Login Error:", error);

  alert(
    `Login Failed:
${error.message}`
  );

  setLoading(false);

  return;
}

      /* GET USER */

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {

        alert("No user found");

        setLoading(false);

        return;
      }

      /* GET USER ROLE */

      const { data: userData } =
        await supabase

          .from("users")

          .select("*")

          .eq("email", email)

          .single();

      if (!userData) {

        alert(
          "User role not found"
        );

        setLoading(false);

        return;
      }

      /* SAVE ROLE */

      localStorage.setItem(
        "role",
        userData.role
      );

      /* REDIRECT BASED ON ROLE */

      if (
        userData.role === "admin"
      ) {

        window.location.href =
          "/dashboard";
      }

      else if (
        userData.role === "cashier"
      ) {

        window.location.href =
          "/orders";
      }

      else if (
        userData.role === "production"
      ) {

        window.location.href =
          "/production";
      }

      else if (
        userData.role === "inventory"
      ) {

        window.location.href =
          "/inventory";
      }

      else if (
        userData.role === "accountant"
      ) {

        window.location.href =
          "/finance";
      }

      setLoading(false);

    }

    catch (err) {

      console.error(err);

      alert(
        "Login failed"
      );

      setLoading(false);
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg">

        {/* HEADER */}

<div className="mb-10 text-center">

  <Image
    src="/logo/nkiruka-logo.png"
    alt="NKIRUKA Logo"
    width={120}
    height={120}
    className="mx-auto mb-4"
  />

  <h1 className="text-4xl font-black text-blue-950">

    NKIRUKA / IRUKA ERP

  </h1>

  <p className="text-gray-500 mt-2">

    INDUSTRIES LTD

  </p>

</div>

        {/* FORM */}

        <div className="space-y-5">

          {/* EMAIL */}

          <input
            type="email"

            placeholder="Email Address"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            className="w-full border-2 border-gray-200 focus:border-blue-900 outline-none p-5 rounded-2xl"
          />

          {/* PASSWORD */}

          <input
            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            className="w-full border-2 border-gray-200 focus:border-blue-900 outline-none p-5 rounded-2xl"
          />

          {/* BUTTON */}

          <button
            onClick={handleLogin}

            disabled={loading}

            className="w-full bg-blue-950 hover:bg-blue-900 text-white p-5 rounded-2xl font-bold text-lg"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </div>

<div className="mt-8 text-center">

  <p className="text-gray-600">
    Don't have an account?
  </p>

  <button
    onClick={() =>
      window.location.href = "/register"
    }
    className="mt-3 border-2 border-blue-950 text-blue-950 px-6 py-3 rounded-2xl font-bold hover:bg-blue-950 hover:text-white"
  >
    Create Account
  </button>

</div>

      </div>

    </div>
  );
}