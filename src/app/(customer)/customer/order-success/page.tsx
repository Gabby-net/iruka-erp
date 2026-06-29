"use client";

import Link from "next/link";
import { CheckCircle2, Receipt } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">

        <CheckCircle2
          size={90}
          className="mx-auto text-green-500"
        />

        <h1 className="text-3xl font-black mt-6 text-[#071028]">
          Order Received!
        </h1>

        <p className="text-gray-500 mt-3 leading-7">

          Thank you for ordering from
          <br />

          <span className="font-bold text-[#B45309]">
            NKIRUKA / IRUKA INDUSTRIES LTD
          </span>

        </p>

        <div className="bg-[#F8F8F8] rounded-2xl p-5 mt-8">

          <div className="flex justify-between mb-4">

            <span className="text-gray-500">
              Status
            </span>

            <span className="font-bold text-orange-600">
              Pending Payment
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-gray-500">
              Order
            </span>

            <span className="font-bold">
              Successfully Created
            </span>

          </div>

        </div>

        <div className="mt-8 space-y-4">

          <Link
            href="/customer/orders"
            className="w-full h-14 rounded-2xl bg-[#B45309] text-white flex items-center justify-center font-bold text-lg"
          >
            <Receipt className="mr-2" size={20} />

            Track My Order
          </Link>

          <Link
            href="/customer/home"
            className="block text-center font-semibold text-[#071028]"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}