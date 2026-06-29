"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useCustomer } from "@/context/CustomerContext";

export default function EditProfilePage() {

  const router = useRouter();

  const {
    customer,
    login,
  } = useCustomer();

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (customer) {

      setFullName(customer.full_name);

      setPhone(customer.phone);

    }

    setLoading(false);

  }, [customer]);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >

            <ArrowLeft className="text-white" />

          </button>

          <h1 className="text-white text-3xl font-black">

            Edit Profile

          </h1>

        </div>

      </div>

      <div className="p-5">

        <div className="bg-white rounded-3xl shadow p-6">

          <div className="mb-6">

            <label className="font-bold">

              Full Name

            </label>

            <div className="mt-2 flex items-center gap-3 border rounded-2xl px-4 py-4">

              <User
                size={20}
                className="text-[#B45309]"
              />

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="flex-1 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="font-bold">

              Phone Number

            </label>

            <div className="mt-2 flex items-center gap-3 border rounded-2xl px-4 py-4">

              <Phone
                size={20}
                className="text-[#B45309]"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="flex-1 outline-none"
              />

            </div>

          </div>

                    <button
            onClick={async () => {

              if (!customer) return;

              if (!fullName.trim()) {
                alert("Please enter your full name.");
                return;
              }

              if (!phone.trim()) {
                alert("Please enter your phone number.");
                return;
              }

              try {

                setSaving(true);

                const { error } = await supabase
                  .from("customers")
                  .update({
                    full_name: fullName,
                    phone: phone,
                  })
                  .eq("id", customer.id);

                if (error) {
                  throw error;
                }

                // Update local customer session immediately
                login({
                  ...customer,
                  full_name: fullName,
                  phone: phone,
                });

                alert("Profile updated successfully.");

                router.push("/customer/profile");

              } catch (error) {

                console.error(error);

                alert("Unable to update profile.");

              } finally {

                setSaving(false);

              }

            }}
            disabled={saving}
            className="w-full mt-8 bg-[#071028] text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-bold disabled:opacity-50"
          >

            <Save size={20} />

            {saving ? "Saving..." : "Save Changes"}

          </button>

        </div>

      </div>

    </main>

  );

}