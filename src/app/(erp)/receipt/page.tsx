"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReceiptContent() {

  const params = useSearchParams();

  const customer =
    params.get("customer");

  const total =
    params.get("total");

  const payment =
    params.get("payment");

  const balance =
    params.get("balance");

  const product =
    params.get("product");

  const quantity =
    params.get("quantity");

  function printReceipt() {
    window.print();
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10 flex justify-center">

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10">

        <div className="text-center border-b pb-6">

          <h1 className="text-5xl font-black text-blue-950">
            IRUKA BAKERY
          </h1>

          <p className="text-gray-600 mt-2">
            Enterprise Bakery Receipt
          </p>

        </div>

        <div className="mt-8 space-y-4">

          <div className="flex justify-between">
            <span className="font-bold">
              Customer:
            </span>
            <span>{customer}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">
              Product:
            </span>
            <span>{product}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold">
              Quantity:
            </span>
            <span>{quantity}</span>
          </div>

        </div>

        <div className="mt-10 border-t pt-6 space-y-4">

          <div className="flex justify-between text-xl">
            <span>Total Amount</span>
            <span className="font-bold text-green-700">
              ₦{Number(total).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Payment</span>
            <span className="font-bold text-blue-700">
              ₦{Number(payment).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-xl">
            <span>Balance</span>
            <span className="font-bold text-red-600">
              ₦{Number(balance).toLocaleString()}
            </span>
          </div>

        </div>

        <div className="mt-10 text-center text-gray-500">
          {new Date().toLocaleString()}
        </div>

        <button
          onClick={printReceipt}
          className="w-full mt-10 bg-black hover:bg-gray-800 text-white p-5 rounded-2xl font-bold text-xl"
        >
          Print Receipt
        </button>

      </div>

    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div>Loading receipt...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}