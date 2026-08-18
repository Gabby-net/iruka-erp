"use client";

import {
  Crown,
  Users,
  ShoppingBag,
  Trophy,
  Star,
} from "lucide-react";

interface TopCustomer {
  name: string;
  orders: number;
  spent: number;
}

interface TopCustomersProps {
  customers: TopCustomer[];
}

export default function TopCustomers({
  customers,
}: TopCustomersProps) {
  const topCustomers = [...customers]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 10);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Top Customers
          </h2>

          <p className="text-slate-400 mt-1">
            Customers contributing the highest revenue.
          </p>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Users className="text-white" />
        </div>

      </div>

      <div className="space-y-4">

        {topCustomers.length === 0 && (
          <div className="text-center py-14">

            <ShoppingBag
              size={50}
              className="mx-auto text-slate-600 mb-4"
            />

            <p className="text-slate-500">
              No customer purchase history yet.
            </p>

          </div>
        )}

        {topCustomers.map((customer, index) => {

          const percentage =
            topCustomers[0]?.spent
              ? Math.round(
                  (customer.spent /
                    topCustomers[0].spent) *
                    100
                )
              : 0;

          return (

            <div
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-amber-500 transition-all"
            >

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold
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

                    <h3 className="text-white text-lg font-bold">
                      {customer.name}
                    </h3>

                    <div className="flex gap-6 mt-2 text-sm">

                      <span className="text-slate-400">
                        Orders:
                        <span className="ml-1 text-white font-semibold">
                          {customer.orders}
                        </span>
                      </span>

                      <span className="text-slate-400">
                        Spent:
                        <span className="ml-1 text-green-400 font-semibold">
                          ₦{customer.spent.toLocaleString()}
                        </span>
                      </span>

                    </div>

                  </div>

                </div>

                <div>

                  {index === 0 && (
                    <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                      <Crown size={18} />
                      VIP
                    </div>
                  )}

                  {index === 1 && (
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Trophy size={18} />
                      Elite
                    </div>
                  )}

                  {index === 2 && (
                    <div className="flex items-center gap-2 text-orange-400 font-semibold">
                      <Star size={18} />
                      Premium
                    </div>
                  )}

                </div>

              </div>

              <div className="mt-5">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-400">
                    Revenue Contribution
                  </span>

                  <span className="text-white font-semibold">
                    {percentage}%
                  </span>

                </div>

                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"
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