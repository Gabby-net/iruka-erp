"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboard } from "@/context/DashboardContext";

export default function SalesOverview() {
  const { revenue } = useDashboard();

  const data = [
    { day: "Mon", sales: 120000 },
    { day: "Tue", sales: 180000 },
    { day: "Wed", sales: 150000 },
    { day: "Thu", sales: 240000 },
    { day: "Fri", sales: 320000 },
    { day: "Sat", sales: 430000 },
    { day: "Sun", sales: 300000 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex justify-between mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Revenue Overview
          </h2>

          <p className="text-slate-500 mt-2">
            Weekly Sales Performance
          </p>

        </div>

        <div>

          <p className="text-slate-500">
            Total Revenue
          </p>

          <h2 className="text-4xl font-black text-emerald-600">
            ₦{revenue.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="h-[380px]">

        <ResponsiveContainer>

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="salesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.6}
                />

                <stop
                  offset="95%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Area
              dataKey="sales"
              stroke="#2563EB"
              fill="url(#salesGradient)"
              strokeWidth={4}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}