"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
}

export default function OrdersPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    const { data } =
      await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setOrders(data || []);

    setLoading(false);
  }

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading Orders...

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <h1 className="text-white text-3xl font-black">

          My Orders

        </h1>

        <p className="text-gray-300 mt-2">

          {orders.length} Orders

        </p>

      </div>

      <div className="p-5 space-y-5">

        {orders.length === 0 && (

          <div className="bg-white rounded-3xl p-8 text-center">

            <Package
              size={70}
              className="mx-auto text-gray-300"
            />

            <h2 className="font-black text-2xl mt-5">

              No Orders Yet

            </h2>

            <p className="text-gray-500 mt-3">

              Your orders will appear here.

            </p>

          </div>

        )}

        {orders.map((order) => (
                      <Link
            key={order.id}
            href={`/customer/orders/${order.id}`}
            className="block"
          >
            <div className="bg-white rounded-3xl shadow-md p-5 hover:shadow-lg transition-all duration-300">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-lg font-black text-[#071028]">
                    {order.order_number}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

                <ChevronRight
                  className="text-gray-400"
                />

              </div>

              <div className="mt-5 flex justify-between items-center">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total
                  </p>

                  <h3 className="text-2xl font-black text-[#B45309]">
                    ₦{Number(order.total_amount).toLocaleString()}
                  </h3>

                </div>

                <div className="text-right">

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.payment_status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>

                  <br />

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                      order.order_status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.order_status === "Preparing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <Clock
                      size={12}
                      className="inline mr-1"
                    />

                    {order.order_status}
                  </span>

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </main>

  );
}