"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Package,
  CreditCard,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  notes: string;
  delivery_date: string;
}

interface OrderItem {
  id: number;
  bread_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", Number(params.id))
      .single();

    if (data) {
      setOrder(data);

      const { data: orderItems } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", data.id);

      setItems(orderItems || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order Not Found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="text-white" />
          </button>

          <div>

            <h1 className="text-white text-3xl font-black">
              Order Details
            </h1>

            <p className="text-gray-300">
              {order.order_number}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 space-y-5">

        <div className="bg-white rounded-3xl shadow p-5">

          <h2 className="font-black text-xl mb-5">
            Customer Information
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <User className="text-[#B45309]" />
              <span>{order.customer_name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-[#B45309]" />
              <span>{order.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-[#B45309]" />
              <span>{order.delivery_date}</span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow p-5">

          <h2 className="font-black text-xl mb-5">
            Ordered Products
          </h2>

          {items.map((item) => (

            <div
              key={item.id}
              className="flex justify-between border-b py-4"
            >

              <div>

                <h3 className="font-bold">
                  {item.bread_type}
                </h3>

                <p className="text-gray-500">
                  Qty: {item.quantity}
                </p>

              </div>

              <div className="font-bold">

                ₦{Number(item.total_amount).toLocaleString()}

              </div>

            </div>

          ))}
                  </div>
<div className="bg-white rounded-3xl shadow p-6">

  <h2 className="text-2xl font-black mb-6">
    Live Order Tracking
  </h2>

  {[
    "Pending",
    "Confirmed",
    "Preparing",
    "Baking",
    "Packaging",
    "Ready",
    "Completed",
  ].map((step, index) => {

    const steps = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Baking",
      "Packaging",
      "Ready",
      "Completed",
    ];

    const currentIndex = steps.indexOf(
      order.order_status || "Pending"
    );

    const completed = index < currentIndex;

    const active = index === currentIndex;

    return (

      <div
        key={step}
        className="flex gap-4 mb-6"
      >

        <div className="flex flex-col items-center">

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              completed
                ? "bg-green-600"
                : active
                ? "bg-yellow-500"
                : "bg-gray-300"
            }`}
          >
            {completed ? "✓" : index + 1}
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`w-1 h-12 ${
                completed
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            />
          )}

        </div>

        <div className="pt-1">

          <h3
            className={`font-bold text-lg ${
              completed
                ? "text-green-700"
                : active
                ? "text-yellow-700"
                : "text-gray-400"
            }`}
          >
            {step}
          </h3>

          {active && (
            <p className="text-sm text-gray-500 mt-1">
              Your order is currently at this stage.
            </p>
          )}

        </div>

      </div>

    );

  })}

</div>

        <div className="bg-white rounded-3xl shadow p-5">

          <h2 className="font-black text-xl mb-5">
            Payment
          </h2>

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">

              <CreditCard className="text-[#B45309]" />

              <span className="font-semibold">
                Payment Status
              </span>

            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                order.payment_status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.payment_status}
            </span>

          </div>

        </div>

        {order.notes && (

          <div className="bg-white rounded-3xl shadow p-5">

            <h2 className="font-black text-xl mb-4">
              Order Note
            </h2>

            <p className="text-gray-600 leading-7">
              {order.notes}
            </p>

          </div>

        )}

        <div className="bg-[#071028] rounded-3xl p-6 text-white">

          <p className="text-gray-300">
            Total Amount
          </p>

          <h2 className="text-4xl font-black mt-2">

            ₦{Number(order.total_amount).toLocaleString()}

          </h2>

        </div>

      </div>

    </main>
  );
}