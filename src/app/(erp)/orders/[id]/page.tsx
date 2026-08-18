"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchOrder();
    }
  }, [params?.id]);

  async function fetchOrder() {
    setLoading(true);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (orderData) {
      setOrder(orderData);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id);

      setItems(itemData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl font-bold">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 text-2xl font-bold">
        Order Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-10">

      <button
        onClick={() => router.push("/orders")}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 font-semibold transition-all duration-300 mb-8"
      >
        ← Back To Orders
      </button>

      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl mb-8">

        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-8 border-b border-slate-700">

          <div className="flex items-center justify-between">

            <div>

              <span className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-300 px-4 py-1 text-sm font-bold mb-4">
                📋 ORDER DETAILS
              </span>

              <h1 className="text-5xl font-black text-white">
                Customer Order Details
              </h1>

              <p className="text-slate-300 mt-3">
                View complete customer information, payment status, delivery schedule and ordered products.
              </p>

            </div>

            <div className="hidden lg:flex w-24 h-24 rounded-3xl bg-white/10 border border-white/20 items-center justify-center text-5xl">
              🧾
            </div>

          </div>

        </div>

        <div className="bg-slate-900 p-8">

          <div className="grid lg:grid-cols-2 gap-8">

            <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black">
                  {order.customer_name?.charAt(0)}
                </div>

                <div>

                  <h2 className="text-2xl font-black text-white">
                    {order.customer_name}
                  </h2>

                  <p className="text-slate-400">
                    Customer Information
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <div>

                  <p className="text-slate-400 text-sm">
                    Phone Number
                  </p>

                  <p className="text-white font-bold text-lg">
                    {order.phone || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-slate-400 text-sm">
                    Order Number
                  </p>

                  <p className="text-white font-bold">
                    {order.order_number}
                  </p>

                </div>

                <div>

                  <p className="text-slate-400 text-sm">
                    Delivery Date
                  </p>

                  <p className="text-white font-bold">
                    {order.delivery_date || "-"}
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">

              <h2 className="text-2xl font-black text-white mb-6">
                Order Status
              </h2>

              <div className="space-y-6">

                <div>

                  <p className="text-slate-400 text-sm mb-2">
                    Payment Status
                  </p>

                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                      order.payment_status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : order.payment_status === "Partially Paid"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.payment_status}
                  </span>

                </div>

                <div>

                  <p className="text-slate-400 text-sm mb-2">
                    Order Status
                  </p>

                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                      order.order_status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : order.order_status === "Ready"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : order.order_status === "Preparing"
                        ? "bg-purple-500/20 text-purple-400"
                        : order.order_status === "Confirmed"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {order.order_status}
                  </span>

                </div>

                <div>

                  <p className="text-slate-400 text-sm mb-2">
                    Notes
                  </p>

                  <div className="rounded-xl bg-slate-950 border border-slate-700 p-4 text-slate-300">
                    {order.notes || "No notes available."}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ORDERED PRODUCTS */}

      <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">

  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-8 py-6 border-b border-slate-700">

    <div className="flex items-center justify-between">

      <div>

        <span className="inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-300 px-4 py-1 text-sm font-bold mb-3">
          🥖 ORDER ITEMS
        </span>

        <h2 className="text-3xl font-black text-white">
          Ordered Products
        </h2>

        <p className="text-slate-300 mt-2">
          Complete list of bread ordered by this customer.
        </p>

      </div>

      <div className="text-5xl">
        📦
      </div>

    </div>

  </div>

  <div className="bg-slate-900 p-8">

    <div className="overflow-x-auto rounded-2xl border border-slate-700">

      <table className="w-full">

        <thead>

          <tr className="bg-slate-800 border-b border-slate-700">

            <th className="text-left p-5 text-slate-300 uppercase text-xs tracking-wider">
              Product
            </th>

            <th className="text-left p-5 text-slate-300 uppercase text-xs tracking-wider">
              Quantity
            </th>

            <th className="text-left p-5 text-slate-300 uppercase text-xs tracking-wider">
              Unit Price
            </th>

            <th className="text-right p-5 text-slate-300 uppercase text-xs tracking-wider">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => (

            <tr
              key={item.id}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition"
            >

              <td className="p-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                    🍞
                  </div>

                  <div>

                    <p className="text-white font-bold">
                      {item.bread_type}
                    </p>

                    <p className="text-slate-400 text-sm">
                      Bakery Product
                    </p>

                  </div>

                </div>

              </td>

              <td className="p-5">

                <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                  {item.quantity}
                </span>

              </td>

              <td className="p-5 text-slate-200 font-semibold">

                ₦{Number(item.unit_price).toLocaleString()}

              </td>

              <td className="p-5 text-right font-black text-emerald-400 text-lg">

                ₦{Number(item.total_amount).toLocaleString()}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    <div className="mt-8 grid lg:grid-cols-2 gap-8">

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">

        <h3 className="text-white font-black text-xl mb-6">
          Order Summary
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span className="text-slate-400">
              Products
            </span>

            <span className="text-white font-bold">
              {items.length}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-400">
              Total Quantity
            </span>

            <span className="text-white font-bold">

              {items.reduce(
                (sum, item) => sum + Number(item.quantity),
                0
              )}

            </span>

          </div>

          <div className="border-t border-slate-700 pt-4 flex justify-between">

            <span className="text-xl text-white font-black">
              Grand Total
            </span>

            <span className="text-3xl font-black text-emerald-400">

              ₦{Number(order.total_amount).toLocaleString()}

            </span>

          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 flex flex-col justify-center gap-4">

        <button
          onClick={() => window.print()}
          className="w-full rounded-2xl bg-blue-700 hover:bg-blue-600 py-4 text-white font-bold transition"
        >
          🖨 Print Invoice
        </button>

        <button
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-4 text-white font-bold transition"
        >
          📄 Download PDF
        </button>

      </div>

    </div>

  </div>

</div>

</div>
);
}