"use client";

import { useEffect, useState } from "react";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function ReportsPage() {

  const [sales, setSales] =
    useState<any[]>([]);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  const [inventory, setInventory] =
    useState<any[]>([]);

  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    const {
      data: salesData,
    } = await supabase

      .from("sales")

      .select("*");

    const {
      data: expenseData,
    } = await supabase

      .from("expenses")

      .select("*");

    const {
      data: inventoryData,
    } = await supabase

      .from("inventory")

      .select("*");

    setSales(salesData || []);

    setExpenses(
      expenseData || []
    );

    setInventory(
      inventoryData || []
    );
  }

  /* =========================
     SALES REPORT
  ========================== */

  function exportSalesReport() {

    const doc =
      new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "IRUKA BAKERY SALES REPORT",
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
        "Customer",
        "Revenue",
        "Payment",
        "Balance",
      ]],

      body: sales.map(
        (sale) => [

          sale.customer_name,

          `₦${sale.total_amount}`,

          `₦${sale.payment}`,

          `₦${sale.balance}`,
        ]
      ),
    });

    doc.save(
      "sales-report.pdf"
    );
  }

  /* =========================
     EXPENSE REPORT
  ========================== */

  function exportExpenseReport() {

    const doc =
      new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "IRUKA BAKERY EXPENSE REPORT",
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
        "Title",
        "Category",
        "Amount",
      ]],

      body: expenses.map(
        (expense) => [

          expense.title,

          expense.category,

          `₦${expense.amount}`,
        ]
      ),
    });

    doc.save(
      "expense-report.pdf"
    );
  }

  /* =========================
     INVENTORY REPORT
  ========================== */

  function exportInventoryReport() {

    const doc =
      new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "IRUKA BAKERY INVENTORY REPORT",
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
        "Material",
        "Quantity",
        "Unit",
      ]],

      body: inventory.map(
        (item) => [

          item.name,

          item.quantity,

          item.unit,
        ]
      ),
    });

    doc.save(
      "inventory-report.pdf"
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

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            PDF Reports Center

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Enterprise reporting & exports

          </p>

        </div>

        {/* REPORT BUTTONS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SALES */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-3xl font-bold mb-4">

              Sales Report

            </h2>

            <p className="text-gray-600 mb-6">

              Export all sales transactions

            </p>

            <button
              onClick={
                exportSalesReport
              }

              className="w-full bg-green-700 hover:bg-green-600 text-white p-4 rounded-2xl font-bold"
            >

              Download PDF

            </button>

          </div>

          {/* EXPENSE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-3xl font-bold mb-4">

              Expense Report

            </h2>

            <p className="text-gray-600 mb-6">

              Export all bakery expenses

            </p>

            <button
              onClick={
                exportExpenseReport
              }

              className="w-full bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl font-bold"
            >

              Download PDF

            </button>

          </div>

          {/* INVENTORY */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-3xl font-bold mb-4">

              Inventory Report

            </h2>

            <p className="text-gray-600 mb-6">

              Export raw material inventory

            </p>

            <button
              onClick={
                exportInventoryReport
              }

              className="w-full bg-blue-950 hover:bg-blue-900 text-white p-4 rounded-2xl font-bold"
            >

              Download PDF

            </button>

          </div>

        </div>

      </div>

    </ProtectedRoute>
  );
}