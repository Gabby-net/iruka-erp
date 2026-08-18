"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Shield,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] = useState("cashier");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

    async function handleRegister() {
  setErrorMessage("");
  setSuccessMessage("");

  if (
    !fullName ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    setErrorMessage("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    setErrorMessage(
      "Password must be at least 6 characters."
    );
    return;
  }

  if (password !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          window.location.origin + "/login",
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setErrorMessage("Unable to create account.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: data.user.id,
        full_name: fullName,
        email,
        role,
      });

    if (insertError) {
      setErrorMessage(insertError.message);
      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Account created successfully. Please check your email and verify your account before logging in."
    );

    setTimeout(() => {
      router.push("/login");
    }, 4000);
  } catch (err) {
    console.error(err);

    setErrorMessage(
      "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#041225] via-[#071d3b] to-[#01060f] flex">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex w-1/2 items-center justify-center p-16">

        <div className="max-w-xl">

          <Image
            src="/logo/nkiruka-logo.png"
            alt="NKIRUKA Logo"
            width={180}
            height={180}
            className="mb-8"
          />

          <h1 className="text-5xl font-black text-white leading-tight">

            NKIRUKA / IRUKA INDUSTRIES LTD

          </h1>

          <p className="mt-5 text-xl text-slate-300">

            Create a new ERP account for authorized staff.

          </p>

          <div className="mt-10 space-y-5">

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

              <h3 className="font-bold text-yellow-400">

                Secure Authentication

              </h3>

              <p className="text-slate-300 mt-2">

                Every account is protected using
                Supabase Authentication.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

              <h3 className="font-bold text-yellow-400">

                Role Based Access

              </h3>

              <p className="text-slate-300 mt-2">

                Staff only see the modules assigned
                to their role.

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* REGISTER FORM */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">

          <div className="text-center lg:hidden">

            <Image
              src="/logo/nkiruka-logo.png"
              alt="Logo"
              width={110}
              height={110}
              className="mx-auto mb-5"
            />

          </div>

          <h2 className="text-3xl font-black text-slate-900">

            Create Account

          </h2>

          <p className="text-slate-500 mt-2">

            Register a new ERP user.

          </p>

          {errorMessage && (

            <div className="mt-6 bg-red-100 border border-red-300 rounded-xl p-4 text-red-700">

              {errorMessage}

            </div>

          )}

          {successMessage && (

            <div className="mt-6 bg-green-100 border border-green-300 rounded-xl p-4 text-green-700">

              {successMessage}

            </div>

          )}

          <div className="space-y-5 mt-8">

            {/* FULL NAME */}

            <div className="relative">

              <User
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-4 outline-none focus:border-blue-700"
              />

            </div>

            {/* EMAIL */}

            <div className="relative">

              <Mail
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-4 outline-none focus:border-blue-700"
              />

            </div>

            {/* ROLE */}

            <div className="relative">

              <Shield
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-4 py-4 outline-none focus:border-blue-700 bg-white"
              >

                <option value="admin">
                  Admin
                </option>

                <option value="cashier">
                  Cashier
                </option>

                <option value="production">
                  Production
                </option>

                <option value="inventory officer">
                  Inventory Officer
                </option>

                <option value="accountant">
                  Accountant
                </option>

              </select>

                          </div>

            {/* PASSWORD */}

            <div className="relative">

              <Lock
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-14 py-4 outline-none focus:border-blue-700"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="relative">

              <Lock
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-300 pl-12 pr-14 py-4 outline-none focus:border-blue-700"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-4 text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-2xl bg-blue-950 hover:bg-blue-900 text-white py-4 font-bold flex justify-center items-center gap-3 transition"
            >
              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            </div>

            <div className="text-center pt-4">

              <p className="text-slate-600">

                Already have an account?

              </p>

              <Link
                href="/login"
                className="inline-block mt-3 bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-xl font-bold text-slate-900 transition"
              >

                Back to Login

              </Link>

            </div>

          </div>

        </div>

      </div>

  );
}