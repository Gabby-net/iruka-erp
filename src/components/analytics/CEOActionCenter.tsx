"use client";

import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Target,
  Factory,
  Wallet,
  Users,
  Package,
  ArrowRight,
} from "lucide-react";

interface CEOActionCenterProps {
  revenue: number;
  expenses: number;
  profit: number;
  lowStockItems: number;
  totalCustomers: number;
  totalOrders: number;
}

export default function CEOActionCenter({
  revenue,
  expenses,
  profit,
  lowStockItems,
  totalCustomers,
  totalOrders,
}: CEOActionCenterProps) {
  const recommendations = [
    {
      title: "Increase Production",
      description:
        "Demand continues to rise. Consider increasing production capacity.",
      icon: Factory,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      show: totalOrders > 100,
    },
    {
      title: "Restock Inventory",
      description:
        "Some raw materials are below their minimum stock level.",
      icon: Package,
      color: "text-red-400",
      bg: "bg-red-500/10",
      show: lowStockItems > 0,
    },
    {
      title: "Reduce Expenses",
      description:
        "Operating expenses are consuming a high percentage of revenue.",
      icon: Wallet,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      show: expenses > revenue * 0.7,
    },
    {
      title: "Customer Growth",
      description:
        "Launch promotions to attract and retain more bakery customers.",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      show: totalCustomers < 100,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-2xl font-bold text-white">
            CEO Action Center
          </h2>

          <p className="text-slate-400 mt-1">
            Intelligent recommendations generated from live ERP data.
          </p>

        </div>

        <Target className="text-amber-400" size={34} />

      </div>

      {/* Business Status */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <TrendingUp className="text-green-400" />

            <span className="text-green-400">
              Revenue
            </span>

          </div>

          <h3 className="text-3xl text-white font-bold mt-4">
            ₦{revenue.toLocaleString()}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <TrendingDown className="text-red-400" />

            <span className="text-red-400">
              Expenses
            </span>

          </div>

          <h3 className="text-3xl text-white font-bold mt-4">
            ₦{expenses.toLocaleString()}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <CheckCircle2 className="text-emerald-400" />

            <span className="text-emerald-400">
              Net Profit
            </span>

          </div>

          <h3 className="text-3xl text-white font-bold mt-4">
            ₦{profit.toLocaleString()}
          </h3>

        </div>

      </div>

      {/* Smart Recommendations */}

      <div className="space-y-4">

        {recommendations
          .filter((item) => item.show)
          .map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-800 p-5 hover:border-amber-500 transition-all"
              >
                <div className="flex justify-between items-center">

                  <div className="flex gap-4">

                    <div
                      className={`h-14 w-14 rounded-xl flex items-center justify-center ${item.bg}`}
                    >
                      <Icon
                        className={item.color}
                        size={28}
                      />
                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 mt-2 max-w-2xl">
                        {item.description}
                      </p>

                    </div>

                  </div>

                  <ArrowRight
                    className="text-slate-500"
                    size={24}
                  />

                </div>
              </div>
            );
          })}

        {recommendations.filter((item) => item.show).length === 0 && (

          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center">

            <CheckCircle2
              className="mx-auto text-green-400 mb-4"
              size={50}
            />

            <h3 className="text-2xl text-white font-bold">
              Excellent Business Performance
            </h3>

            <p className="text-slate-300 mt-3">
              Your ERP indicates that production, finance,
              inventory and customer activities are operating
              within healthy limits. Continue monitoring daily
              operations for sustained growth.
            </p>

          </div>

        )}

      </div>

      {/* Critical Alert */}

      {lowStockItems > 0 && (

        <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5">

          <div className="flex items-center gap-3">

            <AlertTriangle className="text-red-400" />

            <div>

              <h4 className="text-white font-bold">
                Inventory Alert
              </h4>

              <p className="text-slate-300 mt-1">
                {lowStockItems} inventory item(s) require
                immediate replenishment to avoid production
                interruptions.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}