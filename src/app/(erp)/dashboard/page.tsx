"use client";

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

const [sales, setSales] =
useState<any[]>([]);

const [products, setProducts] =
useState<any[]>([]);

const [production, setProduction] =
useState<any[]>([]);

const [inventory, setInventory] =
useState<any[]>([]);

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

setSales(salesData || []);

setProducts(productData || []);

setProduction(productionData || []);

setInventory(inventoryData || []);

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

    <div>

      <h1 className="text-xl md:text-4xl font-black text-[#071028] leading-tight">

        Executive Dashboard

      </h1>

      <p className="text-gray-500 mt-2">

        IRUKA Bread Industries

      </p>

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

            Orders

          </p>

          <h2 className="text-4xl font-black text-blue-700 mt-3">

            {totalSales}

          </h2>

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

            Production

          </p>

          <h2 className="text-4xl font-black text-yellow-500 mt-3">

            {totalProduction}

          </h2>

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

            Low Stock

          </p>

          <h2 className="text-4xl font-black text-red-600 mt-3">

            {lowStock}

          </h2>

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

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {products.map((product) => (

        <div
          key={product.id}
          className="border rounded-3xl p-6 hover:shadow-lg transition-all"
        >

          <div className="h-36 rounded-2xl bg-gradient-to-r from-[#071028] to-[#1e3a8a] mb-5 flex items-center justify-center">

            <h2 className="text-white text-2xl font-black">

              {product.name}

            </h2>

          </div>

          <div className="space-y-2">

            <p className="text-gray-500">

              Current Stock

            </p>

            <h2 className="text-4xl font-black text-[#071028]">

              {product.stock || 0}

            </h2>

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
