"use client";

import {
  Activity,
  Factory,
  ShoppingCart,
  PackageCheck,
  Users,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Business Health",
    value: "Excellent",
    color: "bg-emerald-500",
    icon: Activity,
  },
  {
    title: "Production",
    value: "Running",
    color: "bg-blue-500",
    icon: Factory,
  },
  {
    title: "Orders Today",
    value: "186",
    color: "bg-orange-500",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    value: "Healthy",
    color: "bg-purple-500",
    icon: PackageCheck,
  },
  {
    title: "Customers",
    value: "98% Happy",
    color: "bg-pink-500",
    icon: Users,
  },
  {
    title: "Growth",
    value: "+18.4%",
    color: "bg-cyan-500",
    icon: TrendingUp,
  },
];

export default function ExecutiveStatus() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Background Glow */}

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 transition-all duration-300 group-hover:scale-150" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {item.value}
                </h3>

                <div className="mt-5 flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />

                  <span className="text-sm font-semibold text-emerald-600">
                    Live
                  </span>

                </div>

              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} shadow-lg`}
              >
                <Icon
                  className="text-white"
                  size={30}
                />
              </div>

            </div>
          </div>
        );
      })}
    </section>
  );
}