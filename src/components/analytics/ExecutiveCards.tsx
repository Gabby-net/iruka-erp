"use client";

import {
  DollarSign,
  Wallet,
  ShoppingCart,
  Users,
  Package,
  Factory,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface ExecutiveCardsProps {
  totalRevenue: number;
  totalProfit: number;
  totalExpenses: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalProduction: number;
  inventoryValue: number;
}

export default function ExecutiveCards({
  totalRevenue,
  totalProfit,
  totalExpenses,
  totalOrders,
  totalCustomers,
  totalProducts,
  totalProduction,
  inventoryValue,
}: ExecutiveCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "emerald",
      bg: "from-emerald-500 to-green-600",
    },
    {
      title: "Net Profit",
      value: `₦${totalProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: "blue",
      bg: "from-blue-500 to-indigo-600",
    },
    {
      title: "Expenses",
      value: `₦${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "red",
      bg: "from-red-500 to-rose-600",
    },
    {
      title: "Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "amber",
      bg: "from-amber-500 to-orange-600",
    },
    {
      title: "Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      color: "purple",
      bg: "from-purple-500 to-violet-600",
    },
    {
      title: "Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "cyan",
      bg: "from-cyan-500 to-sky-600",
    },
    {
      title: "Today's Production",
      value: totalProduction.toLocaleString(),
      icon: Factory,
      color: "orange",
      bg: "from-orange-500 to-red-600",
    },
    {
      title: "Inventory Value",
      value: `₦${inventoryValue.toLocaleString()}`,
      icon: Wallet,
      color: "slate",
      bg: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Glow */}
            <div
              className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${card.bg} opacity-10 blur-3xl`}
            />

            <div className="relative p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-white mt-3">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${card.bg} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="text-white" size={28} />
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.bg}`}
                    style={{
                      width: `${60 + (index * 5)}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-500">
                    Performance
                  </span>

                  <span className="text-emerald-400 font-semibold">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}