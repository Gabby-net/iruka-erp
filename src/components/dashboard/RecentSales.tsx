"use client";

import Image from "next/image";
import {
  CreditCard,
  ShoppingBag,
  Clock3,
} from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export default function RecentSales() {
  const { sales } = useDashboard();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Recent Sales
          </h2>

          <p className="text-slate-500 mt-2">
            Latest POS Transactions
          </p>

        </div>

        <button className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {sales.slice(0, 10).map((sale) => (

          <div
            key={sale.id}
            className="rounded-3xl border border-slate-200 p-5 hover:shadow-xl transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-5">

                {/* Avatar */}

                <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center overflow-hidden">

                  <Image
                    src="/logo/nkiruka-logo.png"
                    alt="Customer"
                    width={40}
                    height={40}
                    className="object-contain"
                  />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {sale.customer_name || "Walk-in Customer"}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">

                    <ShoppingBag size={15} />

                    {sale.product_name}

                  </div>

                  <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">

                    <Clock3 size={15} />

                    {sale.created_at
                      ? new Date(
                          sale.created_at
                        ).toLocaleString()
                      : "Today"}

                  </div>

                </div>

              </div>

              <div className="text-right">

                <h2 className="text-2xl font-black text-green-600">

                  ₦
                  {Number(
                    sale.total_amount || 0
                  ).toLocaleString()}

                </h2>

                <div className="flex justify-end mt-3">

                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-2 text-sm font-semibold">

                    <CreditCard size={16} />

                    Paid

                  </span>

                </div>

              </div>

            </div>

            {/* Bottom */}

            <div className="mt-5 flex items-center justify-between border-t pt-4">

              <div className="text-sm text-slate-500">

                Quantity

                <span className="ml-2 font-bold text-slate-900">

                  {sale.quantity}

                </span>

              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 font-semibold">

                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

                Completed

              </span>

            </div>

          </div>

        ))}

        {sales.length === 0 && (

          <div className="rounded-3xl border-2 border-dashed border-slate-300 py-20 text-center">

            <ShoppingBag
              size={50}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-6 text-2xl font-bold text-slate-700">

              No Sales Yet

            </h3>

            <p className="mt-2 text-slate-500">

              Sales transactions will appear here.

            </p>

          </div>

        )}

      </div>

    </div>
  );
}