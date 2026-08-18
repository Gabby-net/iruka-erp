"use client";

import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Package,
  Users,
} from "lucide-react";

interface Props {
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
  customers: number;
  lowStockItems: number;
  bestSellingProduct: string;
}

export default function AIBusinessForecast({
  revenue,
  expenses,
  profit,
  orders,
  customers,
  lowStockItems,
  bestSellingProduct,
}: Props) {

  const insights: {
    icon: any;
    title: string;
    message: string;
    color: string;
  }[] = [];

  if (profit > 0) {
    insights.push({
      icon: TrendingUp,
      title: "Revenue Forecast",
      message:
        "Current business trend indicates positive revenue growth if sales continue at the present rate.",
      color: "text-green-400",
    });
  }

  if (lowStockItems > 0) {
    insights.push({
      icon: Package,
      title: "Inventory Alert",
      message: `${lowStockItems} inventory item(s) are below reorder level. Restocking is recommended.`,
      color: "text-red-400",
    });
  }

  if (customers > orders * 0.6) {
    insights.push({
      icon: Users,
      title: "Customer Insight",
      message:
        "Customer engagement remains healthy. Consider loyalty rewards to increase repeat purchases.",
      color: "text-blue-400",
    });
  }

  insights.push({
    icon: Lightbulb,
    title: "Best Seller",
    message: `${bestSellingProduct} is currently your strongest-performing product. Increasing production may improve revenue.`,
    color: "text-amber-400",
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

      <div className="flex items-center gap-3 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">

          <BrainCircuit className="text-white" size={28} />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">

            AI Business Forecast

          </h2>

          <p className="text-slate-400">

            Intelligent recommendations generated from live ERP data.

          </p>

        </div>

      </div>

      <div className="space-y-5">

        {insights.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex gap-4"
            >

              <div className={item.color}>

                <Icon size={26} />

              </div>

              <div>

                <h3 className={`font-bold ${item.color}`}>

                  {item.title}

                </h3>

                <p className="text-slate-300 mt-2 leading-7">

                  {item.message}

                </p>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}