"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { useDashboard } from "@/context/DashboardContext";

const COLORS = [
  "#2563EB",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
  "#F97316",
];

export default function ProductionSummary() {
  const {
    products,
    totalProduction,
  } = useDashboard();

  const data = products.map(
    (product) => ({
      name: product.name,
      value: Number(
        product.stock || 0
      ),
    })
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Production Summary
          </h2>

          <p className="text-slate-500 mt-2">
            Finished Bread Distribution
          </p>

        </div>

        <div className="text-right">

          <p className="text-slate-500">
            Total Production
          </p>

          <h2 className="text-4xl font-black text-blue-700">
            {totalProduction.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="h-[420px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              innerRadius={80}
              paddingAngle={3}
            >

              {data.map(
                (_, index) => (
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

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}