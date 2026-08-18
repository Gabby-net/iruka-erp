"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  CircleDollarSign,
  Factory,
} from "lucide-react";

export default function QuickInsights() {
  const insights = [
    {
      title: "Revenue Growth",
      value: "+18.5%",
      description: "Compared to yesterday",
      color: "bg-green-50",
      iconColor: "text-green-600",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Production Efficiency",
      value: "96%",
      description: "Excellent performance",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: Factory,
      positive: true,
    },
    {
      title: "Orders Processed",
      value: "186",
      description: "Completed today",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: ShoppingCart,
      positive: true,
    },
    {
      title: "Inventory Health",
      value: "Healthy",
      description: "Only 2 items low",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: Package,
      positive: true,
    },
    {
      title: "Customer Satisfaction",
      value: "98%",
      description: "Excellent rating",
      color: "bg-pink-50",
      iconColor: "text-pink-600",
      icon: Users,
      positive: true,
    },
    {
      title: "Profit Margin",
      value: "74%",
      description: "Above target",
      color: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: CircleDollarSign,
      positive: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">
          Quick Insights
        </h2>

        <p className="text-slate-500 mt-2">
          Executive Summary
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {insights.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.title}
              className={`${item.color} rounded-3xl p-6 border border-slate-200 hover:shadow-xl transition`}
            >

              <div className="flex justify-between items-center">

                <div
                  className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow ${item.iconColor}`}
                >
                  <Icon size={32} />
                </div>

                {item.positive ? (
                  <ArrowUpRight
                    className="text-green-600"
                    size={28}
                  />
                ) : (
                  <ArrowDownRight
                    className="text-red-600"
                    size={28}
                  />
                )}

              </div>

              <h2 className="mt-6 text-4xl font-black text-slate-900">

                {item.value}

              </h2>

              <h3 className="mt-2 text-lg font-bold">

                {item.title}

              </h3>

              <p className="mt-2 text-slate-500">

                {item.description}

              </p>

            </div>

          );
        })}

      </div>

    </div>
  );
}