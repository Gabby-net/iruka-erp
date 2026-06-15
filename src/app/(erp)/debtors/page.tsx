"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function DebtorsPage() {

  const [sales, setSales] =
    useState<any[]>([]);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState("");

  useEffect(() => {

    fetchDebtors();

  }, []);

  async function fetchDebtors() {

    const { data } = await supabase

      .from("sales")

      .select("*")
      .gt("balance", 0)
      .order("created_at", {
        ascending: false,
      });

    setSales(data || []);
  }

  async function recordPayment() {

    if (
      !selectedCustomer ||
      !paymentAmount
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    const customerSales =
      sales.filter(
        (sale) =>
          sale.customer_name ===
          selectedCustomer
      );

    for (const sale of customerSales) {

      let newBalance =
        Number(sale.balance) -
        Number(paymentAmount);

      if (newBalance < 0) {

        newBalance = 0;
      }

      await supabase

        .from("sales")

        .update({
          balance: newBalance,
        })

        .eq("id", sale.id);
    }

    await supabase

      .from("customer_payments")

      .insert([
        {
          customer_name:
            selectedCustomer,

          amount_paid:
            Number(paymentAmount),
        },
      ]);

    alert(
      "Payment recorded successfully"
    );

    setPaymentAmount("");
    setSelectedCustomer("");

    fetchDebtors();
  }

  const totalDebt =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.balance),
      0
    );

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "accountant",
      ]}
    >

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            Customer Debtors

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Enterprise debt management system

          </p>

        </div>

        {/* KPI */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-gray-500 text-lg">

            Total Outstanding Debt

          </h2>

          <p className="text-5xl font-black text-red-600 mt-4">

            ₦
            {totalDebt.toLocaleString()}

          </p>

        </div>

        {/* RECORD PAYMENT */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Record Customer Payment

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select
              value={selectedCustomer}
              onChange={(e) =>
                setSelectedCustomer(
                  e.target.value
                )
              }
              className="border-2 p-4 rounded-2xl"
            >

              <option value="">
                Select Customer
              </option>

              {[
                ...new Set(
                  sales.map(
                    (sale) =>
                      sale.customer_name
                  )
                ),
              ].map((customer) => (

                <option
                  key={customer}
                  value={customer}
                >

                  {customer}

                </option>
              ))}

            </select>

            <input
              type="number"
              placeholder="Amount Paid"

              value={paymentAmount}

              onChange={(e) =>
                setPaymentAmount(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            <button
              onClick={recordPayment}

              className="bg-black hover:bg-gray-800 text-white p-4 rounded-2xl font-bold"
            >

              Record Payment

            </button>

          </div>

        </div>

        {/* DEBTORS TABLE */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Customer Debt Ledger

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Customer

                  </th>

                  <th className="p-4 text-left">

                    Total Amount

                  </th>

                  <th className="p-4 text-left">

                    Payment

                  </th>

                  <th className="p-4 text-left">

                    Balance

                  </th>

                  <th className="p-4 text-left">

                    Date

                  </th>

                </tr>

              </thead>

              <tbody>

                {sales.map((sale) => (

                  <tr
                    key={sale.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold">

                      {sale.customer_name}

                    </td>

                    <td className="p-4 text-green-700 font-bold">

                      ₦
                      {Number(
                        sale.total_amount
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-blue-700 font-bold">

                      ₦
                      {Number(
                        sale.payment
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-red-600 font-bold">

                      ₦
                      {Number(
                        sale.balance
                      ).toLocaleString()}

                    </td>

                    <td className="p-4">

                      {new Date(
                        sale.created_at
                      ).toLocaleString()}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </ProtectedRoute>
  );
}