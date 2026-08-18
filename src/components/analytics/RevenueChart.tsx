"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface RevenueData {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          Revenue Performance
        </h2>

        <p className="text-slate-400 mt-1">
          Revenue, expenses and profit trend.
        </p>

      </div>

      <div className="h-[400px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="name"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
              name="Revenue"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
              name="Expenses"
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
              name="Profit"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}