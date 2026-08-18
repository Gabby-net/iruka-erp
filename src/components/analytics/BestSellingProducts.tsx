"use client";

import {
  Trophy,
  TrendingUp,
  Package,
  Medal,
  Star,
} from "lucide-react";

interface ProductSale {
  name: string;
  quantity: number;
  revenue: number;
}

interface BestSellingProductsProps {
  products: ProductSale[];
}

export default function BestSellingProducts({
  products,
}: BestSellingProductsProps) {
  const topProducts = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Best Selling Products
          </h2>

          <p className="text-slate-400 mt-1">
            Highest-performing bread products by sales quantity.
          </p>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Trophy className="text-black" />
        </div>

      </div>

      <div className="space-y-4">

        {topProducts.length === 0 && (

          <div className="py-16 text-center">

            <Package
              className="mx-auto text-slate-600 mb-4"
              size={48}
            />

            <p className="text-slate-500">
              No sales data available.
            </p>

          </div>

        )}

        {topProducts.map((product, index) => {

          const percentage =
            topProducts[0]?.quantity
              ? Math.round(
                  (product.quantity /
                    topProducts[0].quantity) *
                    100
                )
              : 0;

          return (

            <div
              key={index}
              className="rounded-xl border border-slate-700 bg-slate-800 p-5 hover:border-amber-500 transition-all"
            >

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg
                    ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-slate-400 text-black"
                        : index === 2
                        ? "bg-orange-500 text-black"
                        : "bg-slate-700 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-white">
                      {product.name}
                    </h3>

                    <div className="flex gap-6 mt-2 text-sm">

                      <span className="text-slate-400">
                        Sold:
                        <span className="text-white font-semibold ml-1">
                          {product.quantity}
                        </span>
                      </span>

                      <span className="text-slate-400">
                        Revenue:
                        <span className="text-green-400 font-semibold ml-1">
                          ₦{product.revenue.toLocaleString()}
                        </span>
                      </span>

                    </div>

                  </div>

                </div>

                <div className="text-right">

                  {index === 0 && (
                    <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                      <Trophy size={18} />
                      Champion
                    </div>
                  )}

                  {index === 1 && (
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Medal size={18} />
                      Runner-up
                    </div>
                  )}

                  {index === 2 && (
                    <div className="flex items-center gap-2 text-orange-400 font-semibold">
                      <Star size={18} />
                      Top 3
                    </div>
                  )}

                  {index > 2 && (
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <TrendingUp size={18} />
                      Selling
                    </div>
                  )}

                </div>

              </div>

              <div className="mt-5">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-400">
                    Sales Performance
                  </span>

                  <span className="text-white font-semibold">
                    {percentage}%
                  </span>

                </div>

                <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}