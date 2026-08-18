"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export default function LowStockAlerts() {
  const { inventory } = useDashboard();

  const criticalStock = inventory.filter(
    (item) => Number(item.quantity) <= 10
  );

  const warningStock = inventory.filter(
    (item) =>
      Number(item.quantity) > 10 &&
      Number(item.quantity) <= 30
  );

  const healthyStock = inventory.filter(
    (item) => Number(item.quantity) > 30
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Inventory Health
          </h2>

          <p className="text-slate-500 mt-2">
            Warehouse Stock Monitoring
          </p>

        </div>

        <Package
          size={40}
          className="text-blue-600"
        />

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="rounded-3xl bg-green-50 border border-green-200 p-6">

          <CheckCircle2
            size={38}
            className="text-green-600"
          />

          <h2 className="mt-5 text-4xl font-black text-green-700">
            {healthyStock.length}
          </h2>

          <p className="mt-2 font-semibold text-green-700">
            Healthy Items
          </p>

        </div>

        <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-6">

          <AlertTriangle
            size={38}
            className="text-yellow-600"
          />

          <h2 className="mt-5 text-4xl font-black text-yellow-700">
            {warningStock.length}
          </h2>

          <p className="mt-2 font-semibold text-yellow-700">
            Low Stock
          </p>

        </div>

        <div className="rounded-3xl bg-red-50 border border-red-200 p-6">

          <AlertTriangle
            size={38}
            className="text-red-600"
          />

          <h2 className="mt-5 text-4xl font-black text-red-700">
            {criticalStock.length}
          </h2>

          <p className="mt-2 font-semibold text-red-700">
            Critical Stock
          </p>

        </div>

      </div>

      {/* Critical Materials */}

      <div className="rounded-3xl border border-slate-200 overflow-hidden">

        <div className="bg-slate-100 px-6 py-4">

          <h3 className="text-xl font-bold">
            Critical Inventory
          </h3>

        </div>

        {criticalStock.length === 0 ? (

          <div className="p-8 text-center text-green-600 font-semibold">

            🎉 All inventory items are sufficiently stocked.

          </div>

        ) : (

          criticalStock.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center px-6 py-5 border-t hover:bg-red-50 transition"
            >

              <div>

                <h4 className="font-bold text-lg text-slate-900">

                  {item.material_name}

                </h4>

                <p className="text-slate-500">

                  Remaining Quantity

                </p>

              </div>

              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold">

                {Number(item.quantity).toLocaleString()}

              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}