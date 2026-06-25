"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
PieChart,
Pie,
Cell,
BarChart,
Bar,
} from "recharts";

import {
DollarSign,
ShoppingCart,
Factory,
AlertTriangle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const COLORS = [
"#1e3a8a",
"#facc15",
"#0f172a",
"#2563eb",
];

export default function DashboardPage() {

const [sales, setSales] = useState<any[]>([]);
const [products, setProducts] = useState<any[]>([]);
const [production, setProduction] = useState<any[]>([]);
const [inventory, setInventory] = useState<any[]>([]);

const [expenses, setExpenses] = useState<any[]>([]);
const [debtors, setDebtors] = useState<any[]>([]);

useEffect(() => {

fetchDashboard();

}, []);

async function fetchDashboard() {

const { data: salesData } =
  await supabase
    .from("sales")
    .select("*");

const { data: productData } =
  await supabase
    .from("products")
    .select("*");

const { data: productionData } =
  await supabase
    .from("production_logs")
    .select("*");

const { data: inventoryData } =
  await supabase
    .from("inventory")
    .select("*");

    const { data: expenseData } =
await supabase
.from("expenses")
.select("*");

const { data: debtorData } =
await supabase
.from("debtors")
.select("*");

setSales(salesData || []);

setProducts(productData || []);

setProduction(productionData || []);

setInventory(inventoryData || []);

setExpenses(expenseData || []);

setDebtors(debtorData || []);

}

const revenue =
sales.reduce(
(sum, sale) =>
sum +
Number(
sale.total_amount || 0
),
0
);

const totalExpenses =
expenses.reduce(
  (sum, item) =>
    sum + Number(item.amount || 0),
  0
);

const totalDebts =
debtors.reduce(
  (sum, item) =>
    sum + Number(item.balance || 0),
  0
);

const flourStock =
inventory.find(
  (item) =>
    item.material_name
      ?.toLowerCase()
      .includes("flour")
);

const flourBags =
Number(flourStock?.quantity || 0);

const totalProduction =
production.reduce(
(sum, item) =>
sum +
Number(
item.quantity_produced || 0
),
0
);

const totalSales =
sales.length;

const lowStock =
inventory.filter(
(item) =>
Number(item.quantity) < 10
).length;

const salesChartData = [
{
day: "Mon",
sales: 120000,
},

{
  day: "Tue",
  sales: 180000,
},

{
  day: "Wed",
  sales: 150000,
},

{
  day: "Thu",
  sales: 250000,
},

{
  day: "Fri",
  sales: 300000,
},

{
  day: "Sat",
  sales: 400000,
},

{
  day: "Sun",
  sales: 280000,
},
];

const productionChartData =
products.map((product) => ({
name: product.name,
value: Number(
product.stock || 0
),
}));

return (

<div className="space-y-8">

  {/* HEADER */}

 <div className="flex justify-between items-center">

  <div className="flex items-center gap-4">

    <Image
      src="/logo/nkiruka-logo.png"
      alt="NKIRUKA Logo"
      width={70}
      height={70}
    />

    <div>

      <h1 className="text-xl md:text-4xl font-black text-[#071028] leading-tight">

        Executive Dashboard

      </h1>

      <p className="text-gray-500 mt-2">

        NKIRUKA / IRUKA INDUSTRIES LTD

      </p>

    </div>

  </div>

    <div className="bg-white shadow rounded-2xl px-6 py-4">

      <p className="text-gray-500">

        Today

      </p>

      <p className="font-bold text-[#071028]">

        CEO Analytics Center

      </p>

    </div>

  </div>

  {/* KPI CARDS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">

            Revenue

          </p>

          <h2 className="text-4xl font-black text-green-600 mt-3">

            ₦
            {revenue.toLocaleString()}

          </h2>

        </div>

        <div className="bg-green-100 p-4 rounded-2xl">

          <DollarSign
            size={30}
            className="text-green-600"
          />

        </div>

      </div>

    </div>

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
  Expenses
</p>

<h2 className="text-4xl font-black text-blue-700 mt-3">
  ₦{totalExpenses.toLocaleString()}
</h2>

<p className="text-sm text-gray-400 mt-2">
  Total business expenses
</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-2xl">

          <ShoppingCart
            size={30}
            className="text-blue-700"
          />

        </div>

      </div>

    </div>

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

<p className="text-gray-500">
  Debts Owed
</p>

<h2 className="text-4xl font-black text-orange-500 mt-3">
  ₦{totalDebts.toLocaleString()}
</h2>

<p className="text-sm text-gray-400 mt-2">
  Outstanding customer balances
</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-2xl">

          <Factory
            size={30}
            className="text-yellow-600"
          />

        </div>

      </div>

    </div>

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center">

        <div>

<p className="text-gray-500">
  Flour Remaining
</p>

<h2 className="text-4xl font-black text-red-600 mt-3">
  {flourBags} Bags
</h2>

<p className="text-sm text-gray-400 mt-2">
  Available flour inventory
</p>

        </div>

        <div className="bg-red-100 p-4 rounded-2xl">

          <AlertTriangle
            size={30}
            className="text-red-600"
          />

        </div>

      </div>

    </div>

  </div>

  {/* CHARTS */}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* SALES CHART */}

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-black text-[#071028]">

          Revenue Analytics

        </h2>

        <p className="text-gray-500">

          Weekly Sales Performance

        </p>

      </div>

      <div className="h-[350px] w-full min-w-0">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={salesChartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1e3a8a"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* PIE CHART */}

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-black text-[#071028]">

          Product Stock

        </h2>

        <p className="text-gray-500">

          Available Bread Stock

        </p>

      </div>

      <div className="h-[250px] md:h-[350px] w-full min-w-0">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={
                productionChartData
              }
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              {productionChartData.map(
                (
                  entry,
                  index
                ) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

  {/* PRODUCT STOCK */}

  <div className="bg-white rounded-3xl shadow p-6">

    <div className="flex justify-between items-center mb-6">

      <div>

        <h2 className="text-2xl font-black text-[#071028]">

          Product Inventory

        </h2>

        <p className="text-gray-500">

          Finished Bread Stock

        </p>

      </div>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

      {products.map((product) => (

        <div
          key={product.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl transition-all"
        >

          <div className="h-24 bg-gray-50 rounded-xl flex items-center justify-center mb-3 overflow-hidden">

<img
  src={product.image_url}
  alt={product.name}
  className="max-h-20 object-contain transition-transform duration-300 hover:scale-105"
/>

          </div>

          <div className="space-y-2">

<h3 className="text-lg font-bold text-[#071028] mb-2">
  {product.name}
</h3>

<span
  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
    Number(product.stock) <= 100
      ? "bg-red-100 text-red-600"
      : "bg-green-100 text-green-600"
  }`}
>
  {Number(product.stock) <= 100
    ? "Low Stock"
    : "In Stock"}
</span>

<div>

  <h2 className="text-3xl font-black text-[#071028]">
    {Number(product.stock || 0).toLocaleString()}
  </h2>

  <p className="text-sm text-gray-500">
    Units Available
  </p>

</div>

<div className="flex justify-between items-center mt-3">

  <span className="text-sm text-gray-500">
    Price
  </span>

  <span className="font-bold text-green-600">
    ₦{Number(product.price || 0).toLocaleString()}
  </span>

</div>

<div className="mt-3">

  <div className="w-full bg-gray-200 rounded-full h-2">

    <div
      className="bg-green-600 h-2 rounded-full"
      style={{
        width: `${Math.min(
          (Number(product.stock || 0) / 5000) * 100,
          100
        )}%`,
      }}
    />

  </div>

</div>

<div className="pt-2">

  <button className="text-blue-700 font-semibold text-sm hover:underline">
    View Product →
  </button>

</div>

          </div>

        </div>
      ))}

    </div>

  </div>

  {/* RECENT SALES */}

  <div className="bg-white rounded-3xl shadow p-6">

    <div className="mb-6">

      <h2 className="text-2xl font-black text-[#071028]">

        Recent Sales

      </h2>

      <p className="text-gray-500">

        Latest POS Transactions

      </p>

    </div>

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="bg-gray-100">

            <th className="text-left p-4">

              Product

            </th>

            <th className="text-left p-4">

              Quantity

            </th>

            <th className="text-left p-4">

              Amount

            </th>

          </tr>

        </thead>

        <tbody>

          {sales.slice(0, 10).map(
            (sale) => (

              <tr
                key={sale.id}
                className="border-b"
              >

                <td className="p-4 font-bold">

                  {sale.product_name}

                </td>

                <td className="p-4">

                  {sale.quantity}

                </td>

                <td className="p-4 text-green-600 font-bold">

                  ₦
                  {Number(
                    sale.total_amount
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

);
}
