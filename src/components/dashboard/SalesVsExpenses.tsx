"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { useDashboard } from "@/context/DashboardContext";

export default function SalesVsExpenses() {
  const { revenue, totalExpenses } =
    useDashboard();

  const data = [
    {
      month: "Jan",
      Sales: 1200000,
      Expenses: 600000,
    },
    {
      month: "Feb",
      Sales: 1600000,
      Expenses: 750000,
    },
    {
      month: "Mar",
      Sales: 1850000,
      Expenses: 820000,
    },
    {
      month: "Apr",
      Sales: revenue,
      Expenses: totalExpenses,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">
          Sales vs Expenses
        </h2>

        <p className="text-slate-500 mt-2">
          Business Performance Comparison
        </p>

      </div>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Sales"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="Expenses"
              fill="#F97316"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}