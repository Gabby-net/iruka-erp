"use client";

import {
  Users,
  UserPlus,
  Repeat,
  Star,
} from "lucide-react";

export default function CustomerPerformance() {
  const stats = [
    {
      title: "Active Customers",
      value: "428",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "New Customers",
      value: "36",
      icon: UserPlus,
      color: "bg-emerald-600",
    },
    {
      title: "Returning Rate",
      value: "82%",
      icon: Repeat,
      color: "bg-amber-500",
    },
    {
      title: "Satisfaction",
      value: "98%",
      icon: Star,
      color: "bg-pink-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">
          Customer Performance
        </h2>

        <p className="text-slate-500 mt-2">
          Customer Relationship Analytics
        </p>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition"
            >

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${item.color}`}
              >
                <Icon size={30} />
              </div>

              <h2 className="mt-6 text-4xl font-black text-slate-900">
                {item.value}
              </h2>

              <p className="mt-2 text-slate-500">
                {item.title}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}