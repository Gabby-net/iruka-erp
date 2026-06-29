"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import {
  User,
  Phone,
  ShieldCheck,
  Edit,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Customer {
  id: string;
  full_name: string;
  phone: string;
  is_verified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { customer: loggedInCustomer, logout } = useCustomer();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, []);

  async function loadCustomer() {
    if (!loggedInCustomer) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", loggedInCustomer.id)
      .single();

    if (!error && data) {
      setCustomer(data);
    }

    setLoading(false);
  }

  function handleLogout() {
    const confirmed = confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    logout();

    router.replace("/customer/auth/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">
        <h1 className="text-white text-3xl font-black">
          My Profile
        </h1>
      </div>

      <div className="p-5 space-y-5">

        {/* Profile Card */}

        <div className="bg-white rounded-3xl shadow p-8 text-center">

          <div className="w-28 h-28 rounded-full bg-[#B45309] mx-auto flex items-center justify-center">
            <User
              size={55}
              className="text-white"
            />
          </div>

          <h2 className="text-2xl font-black mt-5">
            {customer?.full_name}
          </h2>

          <p className="text-gray-500 mt-2">
            Customer
          </p>

        </div>

        {/* Personal Information */}

        <div className="bg-white rounded-3xl shadow p-5">

          <h2 className="text-xl font-black mb-5">
            Personal Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <Phone className="text-[#B45309]" />

              <div>
                <p className="text-gray-500 text-sm">
                  Phone Number
                </p>

                <p className="font-bold">
                  {customer?.phone}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <ShieldCheck className="text-green-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Account Status
                </p>

                <p
                  className={`font-bold ${
                    customer?.is_verified
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {customer?.is_verified
                    ? "Verified"
                    : "Not Verified"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Account Actions */}

        <div className="bg-white rounded-3xl shadow overflow-hidden">

<button
  onClick={() =>
    router.push("/customer/profile/edit")
  }
  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
>
  <div className="flex items-center gap-3">

    <Edit className="text-[#B45309]" />

    <span className="font-semibold">
      Edit Profile
    </span>

  </div>

  <span>›</span>

</button>

          <div className="border-t" />

<button
  onClick={() =>
    router.push("/customer/profile/change-password")
  }
  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
>

  <div className="flex items-center gap-3">

    <ShieldCheck className="text-[#B45309]" />

    <span className="font-semibold">
      Change Password
    </span>

  </div>

  <span>›</span>

</button>

          <div className="border-t" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 text-red-600 hover:bg-red-50 transition"
          >
            <div className="flex items-center gap-3">
              <LogOut />

              <span className="font-semibold">
                Logout
              </span>
            </div>

            <span>›</span>
          </button>

        </div>

      </div>

    </main>
  );
}