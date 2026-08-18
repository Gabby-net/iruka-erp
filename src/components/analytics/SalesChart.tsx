"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface SalesData {
  product: string;
  quantity: number;
  revenue: number;
}

interface Props {
  data: SalesData[];
}

const COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F97316",
  "#14B8A6",
];

export default function SalesChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: item.product,
    value: item.quantity,
    revenue: item.revenue,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Sales Performance
        </h2>

        <p className="text-slate-400 mt-1">
          Product sales distribution by quantity sold.
        </p>
      </div>

      <div className="h-[420px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={85}
              outerRadius={145}
              paddingAngle={3}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 12,
                color: "#fff",
              }}
              formatter={(value: any) => [
                `${value} Sold`,
                "Quantity",
              ]}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}