"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/customer-app/Logo";
import { Bell, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCustomer } from "@/context/CustomerContext";
import { useCart } from "@/context/CartContext";

export default function HomeHeader() {
  const router = useRouter();

  const { customer } = useCustomer();
  const { cart } = useCart();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (customer) {
      loadNotifications();
    }
  }, [customer]);

  async function loadNotifications() {
    const { count } = await supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("customer_id", customer?.id)
      .eq("is_read", false);

    setUnreadCount(count || 0);
  }

  return (
    <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-orange-300 text-sm font-medium">
            Good Morning 👋
          </p>

          <h1 className="text-white text-3xl font-black mt-1">
            {customer?.full_name ?? "Customer"}
          </h1>

          <p className="text-gray-300 mt-2">
            Freshly Baked Today
          </p>

        </div>

        <div className="flex items-center gap-3">

          {/* Notifications */}

          <button
            onClick={() =>
              router.push("/customer/notifications")
            }
            className="relative w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
          >

            <Bell
              size={20}
              className="text-white"
            />

            {unreadCount > 0 && (

              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">

                {unreadCount}

              </span>

            )}

          </button>

          {/* Cart */}

          <button
            onClick={() =>
              router.push("/customer/cart")
            }
            className="relative w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
          >

            <ShoppingCart
              size={20}
              className="text-white"
            />

            {cart.length > 0 && (

              <span className="absolute -top-1 -right-1 bg-[#B45309] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">

                {cart.length}

              </span>

            )}

          </button>

          <Logo size={50} />

        </div>

      </div>

    </div>
  );
}