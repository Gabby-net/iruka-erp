"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  BadgeCheck,
} from "lucide-react";

interface FinancialHealthProps {
  revenue: number;
  expenses: number;
  profit: number;
}

export default function FinancialHealth({
  revenue,
  expenses,
  profit,
}: FinancialHealthProps) {
  const profitMargin =
    revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";

  const healthScore =
    revenue === 0
      ? 0
      : Math.max(
          0,
          Math.min(100, Math.round((profit / revenue) * 100 + 60))
        );

  const cashFlow =
    profit > 0 ? "Positive" : profit < 0 ? "Negative" : "Balanced";

  const status =
    healthScore >= 85
      ? "Excellent"
      : healthScore >= 70
      ? "Healthy"
      : healthScore >= 50
      ? "Fair"
      : "Needs Attention";

  const progressColor =
    healthScore >= 85
      ? "from-green-500 to-emerald-400"
      : healthScore >= 70
      ? "from-blue-500 to-cyan-400"
      : healthScore >= 50
      ? "from-yellow-500 to-orange-400"
      : "from-red-500 to-rose-500";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Financial Health
          </h2>

          <p className="text-slate-400 mt-1">
            Executive overview of business financial performance.
          </p>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Activity className="text-black" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
          <div className="flex justify-between items-center">
            <DollarSign className="text-green-400" />

            <span className="text-green-400 font-semibold">
              Revenue
            </span>
          </div>

          <h3 className="text-3xl font-bold text-white mt-5">
            ₦{revenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
          <div className="flex justify-between items-center">
            <TrendingDown className="text-red-400" />

            <span className="text-red-400 font-semibold">
              Expenses
            </span>
          </div>

          <h3 className="text-3xl font-bold text-white mt-5">
            ₦{expenses.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
          <div className="flex justify-between items-center">
            <TrendingUp className="text-emerald-400" />

            <span className="text-emerald-400 font-semibold">
              Net Profit
            </span>
          </div>

          <h3 className="text-3xl font-bold text-white mt-5">
            ₦{profit.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
          <div className="flex justify-between items-center">
            <Wallet className="text-blue-400" />

            <span className="text-blue-400 font-semibold">
              Profit Margin
            </span>
          </div>

          <h3 className="text-3xl font-bold text-white mt-5">
            {profitMargin}%
          </h3>
        </div>

      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-6">
          <div className="flex justify-between mb-4">
            <span className="text-slate-400">
              Financial Health Score
            </span>

            <span className="text-white font-bold">
              {healthScore}%
            </span>
          </div>

          <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${progressColor}`}
              style={{
                width: `${healthScore}%`,
              }}
            />
          </div>

          <div className="mt-6 flex justify-between">

            <div>
              <p className="text-slate-500 text-sm">
                Cash Flow
              </p>

              <p className="text-white font-semibold mt-1">
                {cashFlow}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-sm">
                Business Status
              </p>

              <p className="text-emerald-400 font-semibold mt-1">
                {status}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6">

          <div className="flex items-center gap-3 mb-5">
            <BadgeCheck className="text-amber-400" />

            <h3 className="text-xl font-bold text-white">
              CEO Insight
            </h3>
          </div>

          <div className="space-y-4 text-slate-300">

            <p>
              • Revenue generated:
              <span className="text-green-400 font-semibold">
                {" "}₦{revenue.toLocaleString()}
              </span>
            </p>

            <p>
              • Total operating expenses:
              <span className="text-red-400 font-semibold">
                {" "}₦{expenses.toLocaleString()}
              </span>
            </p>

            <p>
              • Net business profit:
              <span className="text-amber-400 font-semibold">
                {" "}₦{profit.toLocaleString()}
              </span>
            </p>

            <p>
              • Current financial performance is
              <span className="text-blue-400 font-semibold">
                {" "}{status}
              </span>
            </p>

            <div className="pt-4 border-t border-slate-700">

              <p className="text-slate-400 leading-7">
                Continue monitoring operational expenses,
                improve production efficiency and maximize
                high-performing bread products to increase
                profitability.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}