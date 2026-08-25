"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { CalendarDays, ChevronDown } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

export default function FinancePage() {
  // ===============================
  // DATA
  // ===============================
  const [showPL, setShowPL] =
  useState(false);

const [showIncome, setShowIncome] =
  useState(false);

const [showCashFlow, setShowCashFlow] =

  useState(false);
  const [title, setTitle] = useState("");

  const [sales, setSales] = useState<any[]>([]);

  const [expenses, setExpenses] = useState<any[]>([]);

  const [reportPeriod, setReportPeriod] =
  useState("month");

const [lastUpdated, setLastUpdated] =
  useState(new Date());

  // ===============================
  // EXPENSE FORM
  // ===============================

  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("");

const [description, setDescription] = useState("");

  // ===============================
  // FINANCE SUMMARY
  // ===============================

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [totalExpenses, setTotalExpenses] =
    useState(0);

  const [netProfit, setNetProfit] =
    useState(0);

  const [cashAvailable, setCashAvailable] =
    useState(0);

  // ===============================
  // TODAY SUMMARY
  // ===============================

  const [todayRevenue, setTodayRevenue] =
    useState(0);

  const [todayExpenses, setTodayExpenses] =
    useState(0);

  const [todayProfit, setTodayProfit] =
    useState(0);

  const [cashFlow, setCashFlow] =
    useState(0);

  // ===============================
  // MONTHLY SUMMARY
  // ===============================

  const [monthlyRevenue, setMonthlyRevenue] =
    useState(0);

  const [monthlyExpenses, setMonthlyExpenses] =
    useState(0);

  // ===============================
  // LOADING
  // ===============================

  const [loading, setLoading] =
    useState(false);

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    fetchFinance();
  }, []);

  useEffect(() => {
  fetchFinance();
}, [reportPeriod]);
// ===============================
// FETCH FINANCE DATA
// ===============================

async function fetchFinance() {
  setLoading(true);

  try {
    // ===============================
    // SALES
    // ===============================

    const { data: salesData, error: salesError } =
      await supabase
        .from("sales")
        .select("*");

    if (salesError) throw salesError;

    // ===============================
    // EXPENSES
    // ===============================

    const {
      data: expenseData,
      error: expenseError,
    } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (expenseError) throw expenseError;

    const allSales = salesData || [];
const allExpenses = expenseData || [];

const now = new Date();

let salesList = allSales;
let expenseList = allExpenses;

if (reportPeriod === "day") {

  salesList = allSales.filter((sale) => {

    const date = new Date(sale.created_at);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    );

  });

  expenseList = allExpenses.filter((expense) => {

    const date = new Date(expense.created_at);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    );

  });

}

else if (reportPeriod === "month") {

  salesList = allSales.filter((sale) => {

    const date = new Date(sale.created_at);

    return (

      date.getMonth() === now.getMonth() &&

      date.getFullYear() === now.getFullYear()

    );

  });

  expenseList = allExpenses.filter((expense) => {

    const date = new Date(expense.created_at);

    return (

      date.getMonth() === now.getMonth() &&

      date.getFullYear() === now.getFullYear()

    );

  });

}

else if (reportPeriod === "year") {

  salesList = allSales.filter((sale) => {

    const date = new Date(sale.created_at);

    return (

      date.getFullYear() === now.getFullYear()

    );

  });

  expenseList = allExpenses.filter((expense) => {

    const date = new Date(expense.created_at);

    return (

      date.getFullYear() === now.getFullYear()

    );

  });

}

    setSales(salesList);
    setExpenses(expenseList);

    // ===============================
    // TOTAL REVENUE
    // ===============================

    const revenue = salesList.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total_amount || 0
        ),
      0
    );

    // ===============================
    // TOTAL EXPENSES
    // ===============================

    const expenseTotal =
      expenseList.reduce(
        (sum, expense) =>
          sum +
          Number(
            expense.amount || 0
          ),
        0
      );

// ===============================
// MATERIAL / PRODUCTION COST
// ===============================

// Get inventory transactions
const {
  data: inventoryTransactions,
  error: inventoryError,
} = await supabase
  .from("inventory_transactions")
  .select("*")
  .order("created_at", {
    ascending: false,
  });

if (inventoryError) throw inventoryError;

const allInventoryTransactions =
  inventoryTransactions || [];


// ===============================
// GET INVENTORY ITEMS
// ===============================

// Unit cost is stored in the inventory table,
// NOT in inventory_transactions.

const {
  data: inventoryItems,
  error: inventoryError2,
} = await supabase
  .from("inventory")
  .select("*");

if (inventoryError2) throw inventoryError2;

const allInventoryItems =
  inventoryItems || [];


// ===============================
// FILTER MATERIAL TRANSACTIONS
// ===============================

const materialTransactions =
  allInventoryTransactions.filter(
    (transaction) => {

      const transactionDate =
        new Date(transaction.created_at);

      // TODAY
      if (reportPeriod === "day") {
        return (
          transactionDate.getDate() === now.getDate() &&
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      }

      // THIS MONTH
      if (reportPeriod === "month") {
        return (
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      }

      // THIS YEAR
      if (reportPeriod === "year") {
        return (
          transactionDate.getFullYear() ===
          now.getFullYear()
        );
      }

      return true;
    }
  );


// ===============================
// CALCULATE REAL MATERIAL COST
// ===============================

const materialCost =
  materialTransactions.reduce(
    (sum, transaction) => {

      // Only count material deductions
      const type =
        String(
          transaction.transaction_type || ""
        ).toUpperCase();

      if (
        type !== "ISSUED" &&
        type !== "AUTO_DEDUCTION"
      ) {
        return sum;
      }


      // ===============================
      // TRANSACTION QUANTITY
      // ===============================

      const quantity =
        Math.abs(
          Number(
            transaction.quantity_used ??
            transaction.quantity ??
            0
          )
        );


      // ===============================
      // FIND INVENTORY ITEM
      // ===============================

      const inventoryItem =
        allInventoryItems.find(
          (item) => {

            // Most likely relationship
            if (
              transaction.inventory_id &&
              String(item.id) ===
                String(transaction.inventory_id)
            ) {
              return true;
            }

            // Alternative relationship
            if (
              transaction.material_id &&
              String(item.id) ===
                String(transaction.material_id)
            ) {
              return true;
            }

            return false;
          }
        );


      // ===============================
      // UNIT COST FROM INVENTORY TABLE
      // ===============================

      const unitCost =
        Number(
          inventoryItem?.unit_cost ??
          inventoryItem?.cost_per_unit ??
          0
        );


      // ===============================
      // MATERIAL COST
      // ===============================

      const transactionCost =
        quantity * unitCost;


      return sum + transactionCost;

    },
    0
  );


// ===============================
// REAL NET PROFIT
// ===============================
//
// Revenue
// - Material / Production Cost
// - Business Expenses
// = Net Profit

const profit =
  revenue -
  materialCost -
  expenseTotal;


// ===============================
// UPDATE FINANCE
// ===============================

setTotalRevenue(revenue);

setTotalExpenses(
  expenseTotal + materialCost
);

setNetProfit(profit);


// ===============================
// UPDATE FINANCE
// ===============================

setTotalRevenue(revenue);

setTotalExpenses(
  expenseTotal
);

setNetProfit(profit);

    // ===============================
    // AVAILABLE CASH
    // ===============================

    setCashAvailable(profit);

    // ===============================
    // TODAY
    // ===============================

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

            // ===============================
    // TODAY SALES
    // ===============================

    const todaySales = salesList.filter(
      (sale) =>
        sale.created_at?.startsWith(today)
    );

    const todayExpenseList =
      expenseList.filter(
        (expense) =>
          expense.created_at?.startsWith(today)
      );

    const todayRevenueTotal =
      todaySales.reduce(
        (sum, sale) =>
          sum +
          Number(sale.total_amount || 0),
        0
      );

    const todayExpenseTotal =
      todayExpenseList.reduce(
        (sum, expense) =>
          sum +
          Number(expense.amount || 0),
        0
      );

    const todayProfitTotal =
      todayRevenueTotal -
      todayExpenseTotal;

    setTodayRevenue(todayRevenueTotal);

    setTodayExpenses(todayExpenseTotal);

    setTodayProfit(todayProfitTotal);

    // ===============================
    // CASH FLOW
    // ===============================

    setCashFlow(
      todayRevenueTotal -
        todayExpenseTotal
    );

    // ===============================
    // MONTHLY SUMMARY
    // ===============================

    setMonthlyRevenue(revenue);

    setMonthlyExpenses(expenseTotal);

    setMonthlyRevenue(revenue);
setMonthlyExpenses(expenseTotal);

setLastUpdated(new Date());

  } catch (error: any) {
    console.error(
      "Finance Error:",
      error.message
    );
  } finally {
    setLoading(false);
  }
}

async function addExpense() {
  if (!title || !amount || !category) {
    alert("Please fill in all required fields.");
    return;
  }

  const { error } = await supabase
    .from("expenses")
.insert([
{
title,
amount: Number(amount),
category,
},
])

  if (error) {
    alert(error.message);
    return;
  }

setTitle("");
setAmount("");
setCategory("");

  fetchFinance();
}
return (
  <ProtectedRoute
    allowedRoles={[
      "admin",
      "accountant",
    ]}
  >
    <div className="min-h-screen bg-slate-200 p-8">

{/* ==========================
    PREMIUM HEADER
========================== */}

<div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#0B1F3A] to-[#102B52] p-10 mb-10 shadow-2xl border border-white/10">

  {/* Decorative Glow */}

  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

  <div className="absolute -bottom-28 -left-24 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />

  <div className="absolute right-10 top-6 w-40 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 rotate-[-18deg]" />

  <div className="absolute right-8 top-10 w-40 h-[2px] rounded-full bg-yellow-200/60 rotate-[-18deg]" />

  <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

    {/* LEFT */}

    <div className="flex items-center gap-6">

      <div className="relative">

        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl scale-150" />

        <div className="relative w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">

          <Image
            src="/logo/nkiruka-logo.png"
            alt="NKIRUKA"
            width={70}
            height={70}
          />

        </div>

      </div>

      <div>

        <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">

          Finance Department

        </span>

        <h1 className="text-5xl font-black text-white mt-4 tracking-tight">

          Finance Management

        </h1>

        <p className="text-slate-300 text-lg mt-3 max-w-2xl leading-8">

          Manage revenue, expenses, profitability, cash flow and financial reports for NKIRUKA INDUSTRIES LTD.

        </p>

      </div>

    </div>

    {/* RIGHT */}

    <div className="flex flex-wrap gap-5">

      {/* Reporting Period */}

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-5 min-w-[250px]">

        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">

          Reporting Period

        </p>

        <div className="relative">

          <CalendarDays
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"
            size={18}
          />

          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <select
            value={reportPeriod}
            onChange={(e) =>
              setReportPeriod(e.target.value)
            }
            className="w-full appearance-none rounded-2xl border border-white/10 bg-[#132A4D] py-3 pl-12 pr-10 text-white font-semibold outline-none"
          >
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

        </div>

      </div>

      {/* Last Updated */}

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-7 py-5 min-w-[250px]">

        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">

          Last Updated

        </p>

        <p className="text-white text-xl font-bold mt-3">

          {lastUpdated.toLocaleString()}

        </p>

        <p className="text-emerald-400 text-sm mt-2 font-medium">

          ● Live Financial Data

        </p>

      </div>

    </div>

  </div>

</div>

{/* ==========================
    PREMIUM FINANCE KPI
========================== */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-7">

  {/* Revenue */}

  <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-500 to-emerald-700 p-[1px] shadow-2xl">

    <div className="h-full rounded-[30px] bg-[#0D1728] p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-emerald-300 text-sm uppercase tracking-[0.25em]">

            Revenue

          </p>

          <h2 className="text-4xl font-black text-white mt-4">

            ₦{totalRevenue.toLocaleString()}

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-3xl">

          💰

        </div>

      </div>

    </div>

  </div>

  {/* Expenses */}

  <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-red-500 to-rose-700 p-[1px] shadow-2xl">

    <div className="h-full rounded-[30px] bg-[#0D1728] p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-red-300 text-sm uppercase tracking-[0.25em]">

            Expenses

          </p>

          <h2 className="text-4xl font-black text-white mt-4">

            ₦{totalExpenses.toLocaleString()}

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-3xl">

          💸

        </div>

      </div>

    </div>

  </div>

  {/* Profit */}

  <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-yellow-400 to-amber-600 p-[1px] shadow-2xl">

    <div className="h-full rounded-[30px] bg-[#0D1728] p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-yellow-300 text-sm uppercase tracking-[0.25em]">

            Net Profit

          </p>

          <h2 className="text-4xl font-black text-white mt-4">

            ₦{netProfit.toLocaleString()}

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-3xl">

          📈

        </div>

      </div>

    </div>

  </div>

  {/* Cash */}

  <div className="group relative overflow-hidden rounded-[30px] bg-gradient-to-br from-cyan-400 to-blue-700 p-[1px] shadow-2xl">

    <div className="h-full rounded-[30px] bg-[#0D1728] p-7">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-cyan-300 text-sm uppercase tracking-[0.25em]">

            Cash Available

          </p>

          <h2 className="text-4xl font-black text-white mt-4">

            ₦{cashAvailable.toLocaleString()}

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-3xl">

          🏦

        </div>

      </div>

    </div>

  </div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-10">

  {/* Today Revenue */}

  <div className="rounded-[28px] border border-white/10 bg-[#101D33] p-6 shadow-xl">

    <p className="text-slate-400 uppercase text-xs tracking-[0.2em]">

      Today Revenue

    </p>

    <h3 className="text-3xl font-black text-emerald-400 mt-4">

      ₦{todayRevenue.toLocaleString()}

    </h3>

  </div>

  {/* Today Expenses */}

  <div className="rounded-[28px] border border-white/10 bg-[#101D33] p-6 shadow-xl">

    <p className="text-slate-400 uppercase text-xs tracking-[0.2em]">

      Today Expenses

    </p>

    <h3 className="text-3xl font-black text-red-400 mt-4">

      ₦{todayExpenses.toLocaleString()}

    </h3>

  </div>

  {/* Today Profit */}

  <div className="rounded-[28px] border border-white/10 bg-[#101D33] p-6 shadow-xl">

    <p className="text-slate-400 uppercase text-xs tracking-[0.2em]">

      Today Profit

    </p>

    <h3 className="text-3xl font-black text-yellow-400 mt-4">

      ₦{todayProfit.toLocaleString()}

    </h3>

  </div>

  {/* Cash Flow */}

  <div className="rounded-[28px] border border-white/10 bg-[#101D33] p-6 shadow-xl">

    <p className="text-slate-400 uppercase text-xs tracking-[0.2em]">

      Cash Flow

    </p>

    <h3 className="text-3xl font-black text-cyan-400 mt-4">

      ₦{cashFlow.toLocaleString()}

    </h3>

  </div>

</div>

{/* ==========================
    PREMIUM EXPENSE RECORDING
========================== */}

<div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#0D1D34] to-[#132B4A] border border-white/10 shadow-2xl mb-10">

  {/* Background Glow */}

  <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

  <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

  <div className="relative p-10">

    {/* Header */}

    <div className="flex items-center justify-between mb-10">

      <div>

        <span className="inline-flex px-4 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold uppercase tracking-[0.25em]">

          Expense Management

        </span>

        <h2 className="text-4xl font-black text-white mt-4">

          Record New Expense

        </h2>

        <p className="text-slate-400 mt-3 text-lg">

          Record every business expense to maintain accurate financial records.

        </p>

      </div>

      <div className="w-20 h-20 rounded-3xl bg-red-500/15 flex items-center justify-center text-5xl">

        💳

      </div>

    </div>

    {/* Form */}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

      {/* Expense Title */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-3">

          Expense Title

        </label>

        <input
          type="text"
          placeholder="Diesel Purchase"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#162844] text-white px-5 py-4 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />

      </div>

      {/* Amount */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-3">

          Amount

        </label>

        <input
          type="number"
          placeholder="₦0.00"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#162844] text-white px-5 py-4 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />

      </div>

      {/* Category */}

      <div>

        <label className="block text-sm font-semibold text-slate-300 mb-3">

          Category

        </label>

        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#162844] text-white px-5 py-4 outline-none"
        >

          <option value="">Select Category</option>

          <option>Flour Purchase</option>

          <option>Transportation</option>

          <option>Fuel / Diesel</option>

          <option>Electricity</option>

          <option>Staff Salary</option>

          <option>Maintenance</option>

          <option>Packaging</option>

          <option>Office Expense</option>

          <option>Miscellaneous</option>

        </select>

      </div>

    </div>

    {/* Button */}

    <div className="flex justify-end mt-10">

      <button
        onClick={addExpense}
        className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 px-10 py-4 text-white font-bold shadow-xl transition-all duration-300"
      >

        + Record Expense

      </button>

    </div>

  </div>

</div>

{/* ==========================
    PREMIUM FINANCIAL SUMMARY
========================== */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

  {/* Revenue Summary */}

  <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#0C1D36] to-[#132C4A] border border-white/10 shadow-2xl">

    <div className="absolute -top-20 -right-16 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl" />

    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

    <div className="relative p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <span className="inline-flex px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-[0.25em]">

            Financial Overview

          </span>

          <h2 className="text-3xl font-black text-white mt-4">

            Revenue vs Expenses

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-3xl">

          📊

        </div>

      </div>

      <div className="space-y-7">

        <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-6 py-5">

          <span className="text-slate-300 font-medium">

            Total Revenue

          </span>

          <span className="text-3xl font-black text-emerald-400">

            ₦{totalRevenue.toLocaleString()}

          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-6 py-5">

          <span className="text-slate-300 font-medium">

            Total Expenses

          </span>

          <span className="text-3xl font-black text-red-400">

            ₦{totalExpenses.toLocaleString()}

          </span>

        </div>

        <div className="h-px bg-white/10" />

        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/10 border border-yellow-500/20 px-6 py-6">

          <span className="text-lg font-bold text-white">

            Net Profit

          </span>

          <span className="text-4xl font-black text-yellow-400">

            ₦{netProfit.toLocaleString()}

          </span>

        </div>

      </div>

    </div>

  </div>

  {/* Cash Flow */}

  <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#102040] to-[#12355D] border border-white/10 shadow-2xl">

    <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

    <div className="relative p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <span className="inline-flex px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-[0.25em]">

            Cash Position

          </span>

          <h2 className="text-3xl font-black text-white mt-4">

            Cash Flow Summary

          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-3xl">

          🏦

        </div>

      </div>

      <div className="space-y-7">

        <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-6 py-5">

          <span className="text-slate-300">

            Money In

          </span>

          <span className="text-2xl font-black text-emerald-400">

            ₦{totalRevenue.toLocaleString()}

          </span>

        </div>

        <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-6 py-5">

          <span className="text-slate-300">

            Money Out

          </span>

          <span className="text-2xl font-black text-red-400">

            ₦{totalExpenses.toLocaleString()}

          </span>

        </div>

        <div className="h-px bg-white/10" />

        <div className="rounded-3xl bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border border-cyan-500/20 p-7">

          <p className="text-slate-300 text-sm uppercase tracking-[0.2em]">

            Available Cash

          </p>

          <h2 className="text-5xl font-black text-white mt-3">

            ₦{cashAvailable.toLocaleString()}

          </h2>

          <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">

            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

{/* ==========================
    PREMIUM FINANCIAL REPORTS
========================== */}

<div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#0C1D36] to-[#122C4B] border border-white/10 shadow-2xl mb-10">

  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

  <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="relative p-10">

    <div className="flex items-center justify-between mb-10">

      <div>

        <span className="inline-flex px-4 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold uppercase tracking-[0.25em]">

          Executive Reports

        </span>

        <h2 className="text-4xl font-black text-white mt-4">

          Financial Statements

        </h2>

        <p className="text-slate-400 mt-3 text-lg">

          Generate official accounting reports for management and executive decision making.

        </p>

      </div>

      <div className="w-20 h-20 rounded-3xl bg-yellow-500/15 flex items-center justify-center text-5xl">

        📑

      </div>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

      {/* Profit & Loss */}

      <button
        onClick={() => setShowPL(true)}
        className="group rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-yellow-400/40 hover:bg-white/10 transition-all duration-300 text-left"
      >

        <div className="flex items-center justify-between">

          <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-3xl">

            📈

          </div>

          <span className="text-yellow-300 text-xs uppercase tracking-[0.2em]">

            Report

          </span>

        </div>

        <h3 className="text-2xl font-black text-white mt-8">

          Profit & Loss

        </h3>

        <p className="text-slate-400 mt-4 leading-7">

          View revenue, expenses and overall profitability for the selected reporting period.

        </p>

      </button>

      {/* Income Statement */}

      <button
        onClick={() => setShowIncome(true)}
        className="group rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-emerald-400/40 hover:bg-white/10 transition-all duration-300 text-left"
      >

        <div className="flex items-center justify-between">

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-3xl">

            💹

          </div>

          <span className="text-emerald-300 text-xs uppercase tracking-[0.2em]">

            Report

          </span>

        </div>

        <h3 className="text-2xl font-black text-white mt-8">

          Income Statement

        </h3>

        <p className="text-slate-400 mt-4 leading-7">

          Review company income, operating costs and financial performance.

        </p>

      </button>

      {/* Cash Flow */}

      <button
        onClick={() => setShowCashFlow(true)}
        className="group rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 text-left"
      >

        <div className="flex items-center justify-between">

          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-3xl">

            🏦

          </div>

          <span className="text-cyan-300 text-xs uppercase tracking-[0.2em]">

            Report

          </span>

        </div>

        <h3 className="text-2xl font-black text-white mt-8">

          Cash Flow Statement

        </h3>

        <p className="text-slate-400 mt-4 leading-7">

          Monitor money entering and leaving the business throughout the reporting period.

        </p>

      </button>

    </div>

  </div>

</div>

{/* ==========================
    PREMIUM EXPENSE HISTORY
========================== */}

<div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071426] via-[#0C1D36] to-[#122C4B] border border-white/10 shadow-2xl">

  {/* Background Glow */}

  <div className="absolute -top-20 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

  <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="relative p-10">

    {/* Header */}

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

      <div>

        <span className="inline-flex px-4 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold uppercase tracking-[0.25em]">
          Financial Records
        </span>

        <h2 className="text-4xl font-black text-white mt-4">
          Expense History
        </h2>

        <p className="text-slate-400 mt-3">
          View every recorded company expense with complete transaction history.
        </p>

      </div>

      <div className="flex gap-5">

        <div className="rounded-3xl bg-white/5 border border-white/10 px-6 py-4">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Total Expenses
          </p>

          <h3 className="text-3xl font-black text-red-400 mt-2">
            {expenses.length}
          </h3>

        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 px-6 py-4">

          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Total Value
          </p>

          <h3 className="text-3xl font-black text-emerald-400 mt-2">
            ₦{totalExpenses.toLocaleString()}
          </h3>

        </div>

      </div>

    </div>

    {/* Table */}

    <div className="overflow-x-auto rounded-3xl border border-white/10">

      <table className="w-full">

        <thead>

          <tr className="bg-[#132844]">

            <th className="text-left px-6 py-5 text-slate-300 uppercase tracking-[0.2em] text-xs">
              Expense
            </th>

            <th className="text-left px-6 py-5 text-slate-300 uppercase tracking-[0.2em] text-xs">
              Category
            </th>

            <th className="text-left px-6 py-5 text-slate-300 uppercase tracking-[0.2em] text-xs">
              Amount
            </th>

            <th className="text-left px-6 py-5 text-slate-300 uppercase tracking-[0.2em] text-xs">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {expenses.length === 0 ? (

            <tr>

              <td
                colSpan={4}
                className="py-20 text-center"
              >

                <div className="flex flex-col items-center">

                  <div className="text-7xl mb-5">
                    📄
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    No Expense Records
                  </h3>

                  <p className="text-slate-400 mt-3">
                    Expense transactions will appear here after recording.
                  </p>

                </div>

              </td>

            </tr>

          ) : (

            expenses.map((expense) => (

              <tr
                key={expense.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >

                <td className="px-6 py-5">

                  <div>

                    <p className="font-semibold text-white">
                      {expense.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Expense ID #{expense.id}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-5">

                  <span className="inline-flex rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-2 text-sm text-blue-300">

                    {expense.category}

                  </span>

                </td>

                <td className="px-6 py-5">

                  <span className="text-red-400 font-black text-lg">

                    ₦{Number(expense.amount || 0).toLocaleString()}

                  </span>

                </td>

                <td className="px-6 py-5 text-slate-300">

                  {new Date(expense.created_at).toLocaleDateString()}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>

</div>

</ProtectedRoute>

);
}