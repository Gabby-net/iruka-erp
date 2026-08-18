"use client";

import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Package,
  DollarSign,
  Factory,
  ShoppingCart,
  Users,
} from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export default function AIInsights() {
  const {
    revenue,
    totalExpenses,
    flourBags,
    lowStock,
    totalProduction,
    totalSales,
  } = useDashboard();

  const profit = revenue - totalExpenses;

  const insights = [
    {
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
      title: "Revenue Performance",
      message:
        revenue > totalExpenses
          ? "Revenue is higher than operating expenses. Business performance is healthy."
          : "Expenses are approaching revenue. Monitor costs closely.",
    },

    {
      icon: DollarSign,
      color: "bg-blue-100 text-blue-700",
      title: "Profit Analysis",
      message: `Estimated profit today is ₦${profit.toLocaleString()}.`,
    },

    {
      icon: Package,
      color: "bg-orange-100 text-orange-700",
      title: "Flour Inventory",
      message:
        flourBags <= 50
          ? `Only ${flourBags} bags of flour remain. Reorder immediately.`
          : `${flourBags} bags of flour remain in stock.`,
    },

    {
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700",
      title: "Inventory Health",
      message:
        lowStock === 0
          ? "All inventory items are sufficiently stocked."
          : `${lowStock} inventory items require immediate attention.`,
    },

    {
      icon: Factory,
      color: "bg-indigo-100 text-indigo-700",
      title: "Production",
      message: `${totalProduction.toLocaleString()} loaves have been produced today.`,
    },

    {
      icon: ShoppingCart,
      color: "bg-cyan-100 text-cyan-700",
      title: "Sales",
      message: `${totalSales} sales transactions have been completed today.`,
    },

    {
      icon: Users,
      color: "bg-pink-100 text-pink-700",
      title: "Customer Recommendation",
      message:
        "Increase production of your fastest-selling breads during peak morning demand.",
    },

    {
      icon: Brain,
      color: "bg-purple-100 text-purple-700",
      title: "AI Recommendation",
      message:
        "Based on recent sales patterns, prepare additional Jumbo and Classic bread before tomorrow morning to avoid stock shortages.",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center gap-4 mb-8">

        <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 flex items-center justify-center">

          <Brain
            className="text-white"
            size={34}
          />

        </div>

        <div>

          <h2 className="text-3xl font-black text-slate-900">

            AI Business Insights

          </h2>

          <p className="text-slate-500 mt-2">

            Intelligent recommendations generated from your ERP data

          </p>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {insights.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all"
            >

              <div className="flex gap-5">

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center ${item.color}`}
                >

                  <Icon size={28} />

                </div>

                <div className="flex-1">

                  <h3 className="text-xl font-bold text-slate-900">

                    {item.title}

                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">

                    {item.message}

                  </p>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}