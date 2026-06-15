"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    day: "Mon",
    revenue: 120000,
  },

  {
    day: "Tue",
    revenue: 180000,
  },

  {
    day: "Wed",
    revenue: 150000,
  },

  {
    day: "Thu",
    revenue: 220000,
  },

  {
    day: "Fri",
    revenue: 280000,
  },

  {
    day: "Sat",
    revenue: 320000,
  },

  {
    day: "Sun",
    revenue: 260000,
  },
];

export default function RevenueChart() {

  return (

    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-[#071028]">

            Sales Overview

          </h2>

          <p className="text-gray-500">

            Weekly Revenue Analytics

          </p>

        </div>

        <div>

          <h2 className="text-2xl font-black text-green-600">

            ₦1.53M

          </h2>

        </div>

      </div>

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1e3a8a"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}