"use client";

import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Boxes,
} from "lucide-react";

interface InventoryItem {
  material_name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

interface InventoryHealthProps {
  inventory: InventoryItem[];
}

export default function InventoryHealth({
  inventory,
}: InventoryHealthProps) {
  const totalItems = inventory.length;

  const healthyItems = inventory.filter(
    (item) => item.current_stock > item.minimum_stock
  ).length;

  const lowItems = inventory.filter(
    (item) => item.current_stock <= item.minimum_stock
  ).length;

  const health =
    totalItems === 0
      ? 0
      : Math.round((healthyItems / totalItems) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Inventory Health
          </h2>

          <p className="text-slate-400 mt-1">
            Monitor warehouse stock levels across all raw materials.
          </p>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Boxes className="text-black" />
        </div>

      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <Package className="text-blue-400" />

            <span className="text-blue-400">
              Materials
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {totalItems}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <CheckCircle2 className="text-green-400" />

            <span className="text-green-400">
              Healthy
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {healthyItems}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <AlertTriangle className="text-red-400" />

            <span className="text-red-400">
              Low Stock
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {lowItems}
          </h3>

        </div>

      </div>

      {/* Health Bar */}

      <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 mb-8">

        <div className="flex justify-between mb-3">

          <span className="text-slate-300">
            Overall Inventory Health
          </span>

          <span className="text-white font-bold">
            {health}%
          </span>

        </div>

        <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">

          <div
            className={`h-full ${
              health >= 80
                ? "bg-green-500"
                : health >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${health}%`,
            }}
          />

        </div>

      </div>

      {/* Inventory Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left py-4 text-slate-400">
                Material
              </th>

              <th className="text-left py-4 text-slate-400">
                Current Stock
              </th>

              <th className="text-left py-4 text-slate-400">
                Minimum
              </th>

              <th className="text-left py-4 text-slate-400">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {inventory.map((item, index) => {

              const healthy =
                item.current_stock > item.minimum_stock;

              return (

                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >

                  <td className="py-5 text-white font-medium">
                    {item.material_name}
                  </td>

                  <td className="py-5 text-slate-300">
                    {item.current_stock} {item.unit}
                  </td>

                  <td className="py-5 text-slate-400">
                    {item.minimum_stock} {item.unit}
                  </td>

                  <td className="py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        healthy
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {healthy ? "Healthy" : "Low Stock"}
                    </span>

                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}