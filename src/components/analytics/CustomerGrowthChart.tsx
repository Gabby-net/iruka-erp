"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface CustomerGrowthData {
  month: string;
  orders: number;
}

interface Props {
  data: CustomerGrowthData[];
}

export default function CustomerGrowthChart({
  data,
}: Props) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="mb-6">

<h2 className="text-2xl font-bold text-white">
  Customer Performance
</h2>

<p className="text-slate-400 mt-1">
  Analyze customer purchasing behavior, order activity and business contribution.
</p>

        <p className="text-slate-400 mt-1">
          Monthly customer registration trend.
        </p>

      </div>

      <div className="h-[420px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
          >

            <defs>

              <linearGradient
                id="customerGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0.05}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 12,
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="orders"
              stroke="#3B82F6"
              fill="url(#customerGradient)"
              strokeWidth={4}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}