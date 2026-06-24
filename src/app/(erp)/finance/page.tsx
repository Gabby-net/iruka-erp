"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function FinancePage() {

  const [sales, setSales] =
    useState<any[]>([]);

  const [expenses, setExpenses] =
    useState<any[]>([]);

    const [debtors, setDebtors] =
  useState<any[]>([]);

  const [paymentAmount, setPaymentAmount] =
  useState("");

const [selectedDebtor, setSelectedDebtor] =
  useState<any>(null);

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [totalExpenses, setTotalExpenses] =
    useState(0);

  const [netProfit, setNetProfit] =
    useState(0);

  const [todayRevenue, setTodayRevenue] =
  useState(0);

const [todayExpenses, setTodayExpenses] =
  useState(0);

const [todayProfit, setTodayProfit] =
  useState(0);  

    const [totalDebtors, setTotalDebtors] =
  useState(0);

  const [outstandingBalance, setOutstandingBalance] =
  useState(0);

  useEffect(() => {

    fetchFinance();

  }, []);

  async function fetchFinance() {

    /* =========================
       FETCH SALES
    ========================== */

    const {
      data: salesData,
    } = await supabase

      .from("sales")

      .select("*");

    setSales(salesData || []);

    /* =========================
       FETCH EXPENSES
    ========================== */

    const {
      data: expenseData,
    } = await supabase

      .from("expenses")

      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setExpenses(
      expenseData || []
    );

    /* =========================
       TOTAL REVENUE
    ========================== */

    const revenue =
      (salesData || []).reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.total_amount
          ),
        0
      );

    setTotalRevenue(
      revenue
    );

    /* =========================
       TOTAL EXPENSES
    ========================== */

    const expenseTotal =
      (expenseData || []).reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount
          ),
        0
      );

    setTotalExpenses(
      expenseTotal
    );

    /* =========================
       NET PROFIT
    ========================== */

    setNetProfit(
      revenue - expenseTotal
    );

    const today =
  new Date()
    .toISOString()
    .split("T")[0];

const todaySales =
  (salesData || []).filter(
    (sale) =>
      sale.created_at?.startsWith(
        today
      )
  );

const todayExpenseList =
  (expenseData || []).filter(
    (expense) =>
      expense.created_at?.startsWith(
        today
      )
  );

const todayRevenueTotal =
  todaySales.reduce(
    (sum, sale) =>
      sum +
      Number(
        sale.total_amount || 0
      ),
    0
  );

const todayExpenseTotal =
  todayExpenseList.reduce(
    (sum, expense) =>
      sum +
      Number(
        expense.amount || 0
      ),
    0
  );

setTodayRevenue(
  todayRevenueTotal
);

setTodayExpenses(
  todayExpenseTotal
);

setTodayProfit(
  todayRevenueTotal -
    todayExpenseTotal
);

    const debtorList =
  (salesData || []).filter(
    (sale) =>
      Number(sale.balance) > 0
  );

setTotalDebtors(
  debtorList.length
);

const totalOutstanding =
  debtorList.reduce(
    (sum, sale) =>
      sum +
      Number(
        sale.balance || 0
      ),
    0
  );

  setDebtors(
  debtorList
);

setOutstandingBalance(
  totalOutstanding
);
  }

  async function addExpense() {

    if (
      !title ||
      !amount ||
      !category
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    await supabase

      .from("expenses")

      .insert([
        {
          title,
          amount:
            Number(amount),
          category,
        },
      ]);

    setTitle("");
    setAmount("");
    setCategory("");

    fetchFinance();

    alert(
      "Expense added successfully"
    );
  }

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "accountant",
      ]}
    >

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

<div className="flex items-center gap-4 mb-8">

  <Image
    src="/logo/nkiruka-logo.png"
    alt="NKIRUKA Logo"
    width={70}
    height={70}
  />

  <div>

    <h1 className="text-4xl font-black text-blue-950">

      Finance Dashboard

    </h1>

    <p className="text-gray-500">

      NKIRUKA / IRUKA INDUSTRIES LTD

    </p>

  </div>

</div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          {/* REVENUE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Total Revenue

            </h2>

            <p className="text-5xl font-black text-green-700 mt-4">

              ₦
              {totalRevenue.toLocaleString()}

            </p>

          </div>

          {/* EXPENSES */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Total Expenses

            </h2>

            <p className="text-5xl font-black text-red-600 mt-4">

              ₦
              {totalExpenses.toLocaleString()}

            </p>

          </div>

          {/* PROFIT */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Net Profit

            </h2>

            <p className="text-5xl font-black text-blue-950 mt-4">

              ₦
              {netProfit.toLocaleString()}

            </p>

          </div>

          <div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-gray-500 text-lg">

    Outstanding Balance

  </h2>

  <p className="text-5xl font-black text-orange-600 mt-4">

    ₦
    {outstandingBalance.toLocaleString()}

  </p>

</div>

<div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-gray-500 text-lg">

    Total Debtors

  </h2>

  <p className="text-5xl font-black text-red-600 mt-4">

    {totalDebtors}

  </p>

  <div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-gray-500 text-lg">
    Today's Revenue
  </h2>

  <p className="text-5xl font-black text-green-600 mt-4">

    ₦{todayRevenue.toLocaleString()}

  </p>

</div>

<div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-gray-500 text-lg">
    Today's Expenses
  </h2>

  <p className="text-5xl font-black text-red-600 mt-4">

    ₦{todayExpenses.toLocaleString()}

  </p>

</div>

<div className="bg-white rounded-3xl shadow p-8">

  <h2 className="text-gray-500 text-lg">
    Today's Profit
  </h2>

  <p className="text-5xl font-black text-blue-950 mt-4">

    ₦{todayProfit.toLocaleString()}

  </p>

</div>

</div>

        </div>

        {/* ADD EXPENSE */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Add Expense

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Expense Title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="border-2 p-4 rounded-2xl"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              className="border-2 p-4 rounded-2xl"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="border-2 p-4 rounded-2xl"
            />

          </div>

          <button
            onClick={addExpense}
            className="mt-6 bg-black hover:bg-gray-800 text-white p-4 rounded-2xl font-bold"
          >

            Add Expense

          </button>

        </div>

        {/* EXPENSE TABLE */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Expense History

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Title

                  </th>

                  <th className="p-4 text-left">

                    Category

                  </th>

                  <th className="p-4 text-left">

                    Amount

                  </th>

                  <th className="p-4 text-left">

                    Date

                  </th>

                  <th className="p-4 text-left">

  Action

</th>

                </tr>

              </thead>

              <tbody>

                {expenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-semibold">

                        {expense.title}

                      </td>

                      <td className="p-4">

                        {expense.category}

                      </td>

                      <td className="p-4 text-red-600 font-bold">

                        ₦
                        {Number(
                          expense.amount
                        ).toLocaleString()}

                      </td>

                      <td className="p-4">

                        {new Date(
                          expense.created_at
                        ).toLocaleString()}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

<div className="bg-white rounded-3xl shadow p-8 mt-10">

  <h2 className="text-3xl font-bold mb-6">

    Debtors List

  </h2>

  <div className="overflow-x-auto">

  <table className="w-full">

    <thead>

      <tr className="border-b bg-gray-50">

        <th className="p-4 text-left">

          Invoice

        </th>

        <th className="p-4 text-left">

          Customer

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

  {debtors.map(
    (debtor) => (

      <tr
        key={debtor.id}
        className="border-b hover:bg-gray-50"
      >

        <td className="p-4">

          {debtor.invoice_number}

        </td>

        <td className="p-4 font-semibold">

          {debtor.customer_name}

        </td>

        <td className="p-4 text-red-600 font-bold">

          ₦
          {Number(
            debtor.balance || 0
          ).toLocaleString()}

        </td>

        <td className="p-4">

          {new Date(
            debtor.created_at
          ).toLocaleString()}

        </td>

      </tr>

    )
  )}

</tbody>

    <tbody>

  {debtors.map(
    (debtor) => (

      <tr
        key={debtor.id}
        className="border-b hover:bg-gray-50"
      >

        <td className="p-4">

          {debtor.invoice_number}

        </td>

        <td className="p-4 font-semibold">

          {debtor.customer_name}

        </td>

        <td className="p-4 text-red-600 font-bold">

          ₦
          {Number(
            debtor.balance || 0
          ).toLocaleString()}

        </td>

        <td className="p-4">

          {new Date(
            debtor.created_at
          ).toLocaleString()}

        </td>

      </tr>

    )
  )}

</tbody>

  </table>

</div>

</div>

</div>

</ProtectedRoute>
  );
}