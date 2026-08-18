"use client";

import {
  TrendingUp,
  Package,
  Award,
  DollarSign,
} from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export default function ProductPerformance() {
  const { products } = useDashboard();

  const sortedProducts = [...products]
    .sort(
      (a, b) =>
        Number(b.stock || 0) -
        Number(a.stock || 0)
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-900">
            Product Performance
          </h2>

          <p className="text-slate-500 mt-2">
            Top Performing Bread Products
          </p>

        </div>

        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center">

          <TrendingUp
            size={32}
            className="text-white"
          />

        </div>

      </div>

      <div className="space-y-5">

        {sortedProducts.map(
          (product, index) => {

            const percent =
              Math.min(
                (Number(product.stock || 0) /
                  5000) *
                  100,
                100
              );

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition"
              >

                <div className="flex items-center gap-5">

                  <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 object-contain"
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {product.name}
                        </h3>

                        <p className="text-slate-500 mt-1">
                          Premium Bread
                        </p>

                      </div>

                      <div className="text-right">

                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-sm font-bold">

                          <Award size={16} />

                          #{index + 1}

                        </span>

                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-5 mt-6">

                      <div>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">

                          <Package size={16} />

                          Stock

                        </div>

                        <h4 className="text-2xl font-black mt-2">
                          {Number(
                            product.stock || 0
                          ).toLocaleString()}
                        </h4>

                      </div>

                      <div>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">

                          <DollarSign size={16} />

                          Price

                        </div>

                        <h4 className="text-2xl font-black mt-2 text-green-600">

                          ₦
                          {Number(
                            product.price || 0
                          ).toLocaleString()}

                        </h4>

                      </div>

                      <div>

                        <div className="text-slate-500 text-sm">

                          Performance

                        </div>

                        <div className="mt-3 w-full h-3 rounded-full bg-slate-200">

                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                            style={{
                              width: `${percent}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}