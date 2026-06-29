"use client";

import { useEffect, useState } from "react";
import { Bell, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCustomer } from "@/context/CustomerContext";

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();

  const { customer } = useCustomer();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customer) {
      loadNotifications();
    }
  }, [customer]);

  async function loadNotifications() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("customer_id", customer?.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data || []);
    setLoading(false);
  }

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
            Notifications
          </h1>

        </div>

      </div>

      <div className="p-5 space-y-4">

        {notifications.length === 0 && (

          <div className="bg-white rounded-3xl p-10 text-center shadow">

            <Bell
              size={60}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-xl font-bold mt-4">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              You're all caught up.
            </p>

          </div>

        )}

        {notifications.map((notification) => (

          <button
            key={notification.id}
onClick={() => {}}
            className={`w-full text-left rounded-3xl p-5 shadow transition ${
              notification.is_read
                ? "bg-white"
                : "bg-yellow-50 border-l-4 border-yellow-500"
            }`}
          >

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-full bg-[#071028] flex items-center justify-center">

                <Bell className="text-white" />

              </div>

              <div>

                <h2 className="font-black text-lg">

                  {notification.title}

                </h2>

                <p className="text-gray-600 mt-1">

                  {notification.message}

                </p>

                <p className="text-xs text-gray-400 mt-3">

                  {new Date(
                    notification.created_at
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          </button>

        ))}

      </div>

    </main>
  );
}