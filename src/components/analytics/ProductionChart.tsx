"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ProductionData {
  product: string;
  produced: number;
  waste: number;
}

interface Props {
  data: ProductionData[];
}

export default function ProductionChart({
  data,
}: Props) {

  const chartData = data.map((item) => ({
    ...item,
    efficiency:
      item.produced === 0
        ? 0
        : Number(
            (
              ((item.produced - item.waste) /
                item.produced) *
              100
            ).toFixed(1)
          ),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          Production Analytics
        </h2>

        <p className="text-slate-400 mt-1">
          Production, waste and efficiency.
        </p>

      </div>

      <div className="h-[420px]">

        <ResponsiveContainer>

          <BarChart
            data={chartData}
            barGap={4}
            barCategoryGap={18}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

<XAxis dataKey="product" />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "14px",
                color: "#fff",
              }}
            />

            <Legend />

            <Bar
              dataKey="produced"
              stackId="production"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
              name="Produced"
            />

            <Bar
              dataKey="waste"
              stackId="production"
              fill="#EF4444"
              radius={[8, 8, 0, 0]}
              name="Waste"
            />

            <Bar
              dataKey="efficiency"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              name="Efficiency %"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}