"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {

  const [sales, setSales] =
    useState<any[]>([]);

  const [products, setProducts] =
    useState<any[]>([]);

  const [inventory, setInventory] =
    useState<any[]>([]);

  const [productionLogs, setProductionLogs] =
    useState<any[]>([]);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [todayRevenue, setTodayRevenue] =
    useState(0);

  const [totalOrders, setTotalOrders] =
    useState(0);

  const [outstandingBalance, setOutstandingBalance] =
    useState(0);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  async function fetchAnalytics() {

    /* =========================
       FETCH SALES
    ========================== */

    const {
      data: salesData,
    } = await supabase

      .from("sales")

      .select("*");

    /* =========================
       FETCH PRODUCTS
    ========================== */

    const {
      data: productsData,
    } = await supabase

      .from("products")

      .select("*");

    /* =========================
       FETCH INVENTORY
    ========================== */

    const {
      data: inventoryData,
    } = await supabase

      .from("inventory")

      .select("*");

    /* =========================
       FETCH PRODUCTION
    ========================== */

    const {
      data: productionData,
    } = await supabase

      .from("production_logs")

      .select("*");

    setSales(salesData || []);

    setProducts(productsData || []);

    setInventory(
      inventoryData || []
    );

    setProductionLogs(
      productionData || []
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
       TODAY REVENUE
    ========================== */

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const todaySales =
      (salesData || []).filter(
        (sale) =>
          sale.created_at
            ?.split("T")[0] ===
          today
      );

    const todayTotal =
      todaySales.reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.total_amount
          ),
        0
      );

    setTodayRevenue(
      todayTotal
    );

    /* =========================
       TOTAL ORDERS
    ========================== */

    setTotalOrders(
      salesData?.length || 0
    );

    /* =========================
       OUTSTANDING BALANCE
    ========================== */

    const balances =
      (salesData || []).reduce(
        (sum, sale) =>
          sum +
          Number(
            sale.balance
          ),
        0
      );

    setOutstandingBalance(
      balances
    );
  }

  /* =========================
     LOW STOCK ITEMS
  ========================== */

  const lowStockItems =
    inventory.filter(
      (item) =>
        Number(item.quantity) <
        10
    );

  /* =========================
     BEST SELLING PRODUCT
  ========================== */

  const bestSelling =
    products.sort(
      (a, b) =>
        Number(b.stock) -
        Number(a.stock)
    )[0];

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

            Executive Analytics

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            CEO enterprise bakery insights dashboard

          </p>

        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* TOTAL REVENUE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Total Revenue

            </h2>

            <p className="text-4xl font-black text-green-700 mt-4">

              ₦
              {totalRevenue.toLocaleString()}

            </p>

          </div>

          {/* TODAY REVENUE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Today's Revenue

            </h2>

            <p className="text-4xl font-black text-blue-700 mt-4">

              ₦
              {todayRevenue.toLocaleString()}

            </p>

          </div>

          {/* TOTAL ORDERS */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Total Transactions

            </h2>

            <p className="text-4xl font-black text-purple-700 mt-4">

              {totalOrders}

            </p>

          </div>

          {/* OUTSTANDING */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-gray-500 text-lg">

              Outstanding Debt

            </h2>

            <p className="text-4xl font-black text-red-600 mt-4">

              ₦
              {outstandingBalance.toLocaleString()}

            </p>

          </div>

        </div>

        {/* SECOND ROW */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* BEST SELLING */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-3xl font-bold mb-6">

              Best Selling Product

            </h2>

            {bestSelling ? (

              <div>

                <p className="text-4xl font-black text-blue-950">

                  {bestSelling.name}

                </p>

                <p className="text-gray-600 mt-3 text-xl">

                  Remaining Stock:
                  {" "}
                  {bestSelling.stock}

                </p>

              </div>

            ) : (

              <p>No products found</p>

            )}

          </div>

          {/* PRODUCTION */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-3xl font-bold mb-6">

              Production Summary

            </h2>

            <p className="text-5xl font-black text-green-700">

              {
                productionLogs.length
              }

            </p>

            <p className="text-gray-600 mt-3 text-xl">

              Total Production Logs

            </p>

          </div>

        </div>

        {/* LOW STOCK ALERTS */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold text-red-600 mb-6">

            Low Stock Alerts

          </h2>

          {lowStockItems.length === 0 ? (

            <p className="text-green-700 font-bold text-xl">

              No low stock items

            </p>

          ) : (

            <div className="flex flex-col gap-4">

              {lowStockItems.map(
                (item) => (

                  <div
                    key={item.id}
                    className="bg-red-50 border border-red-200 p-5 rounded-2xl"
                  >

                    <p className="text-2xl font-bold text-red-700">

                      {item.name}

                    </p>

                    <p className="text-gray-700 mt-2">

                      Remaining:
                      {" "}
                      {item.quantity}
                      {" "}
                      {item.unit}

                    </p>

                  </div>
                )
              )}

            </div>

          )}

        </div>

        {/* RECENT SALES */}

        <div className="bg-white rounded-3xl shadow p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-3xl font-bold">

              Recent Transactions

            </h2>

            <div className="bg-blue-950 text-white px-5 py-3 rounded-2xl font-bold">

              {sales.length} Records

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Customer

                  </th>

                  <th className="p-4 text-left">

                    Revenue

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