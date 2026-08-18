"use client";

import {
  ArrowUpRight,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
} from "lucide-react";

interface Props {
  revenueGrowth: number;
  salesGrowth: number;
  customerGrowth: number;
  productionGrowth: number;
  profitMargin: number;
}

export default function BusinessGrowthIndex({
  revenueGrowth,
  salesGrowth,
  customerGrowth,
  productionGrowth,
  profitMargin,
}: Props) {

  const overallScore = Math.round(
    (
      revenueGrowth +
      salesGrowth +
      customerGrowth +
      productionGrowth +
      profitMargin
    ) / 5
  );

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">

            Business Growth Index

          </h2>

          <p className="text-slate-400 mt-1">

            Overall business performance score.

          </p>

        </div>

        <div className="text-right">

          <p className="text-slate-400 text-sm">

            Overall Score

          </p>

          <h1 className="text-5xl font-black text-amber-400">

            {overallScore}%

          </h1>

        </div>

      </div>

      <div className="w-full h-3 bg-slate-800 rounded-full mt-6 overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-green-500 via-amber-400 to-orange-500 rounded-full"
          style={{
            width: `${overallScore}%`,
          }}
        />

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-8">

        <Metric
          icon={<DollarSign size={20} />}
          title="Revenue"
          value={revenueGrowth}
        />

        <Metric
          icon={<ShoppingCart size={20} />}
          title="Sales"
          value={salesGrowth}
        />

        <Metric
          icon={<Users size={20} />}
          title="Customers"
          value={customerGrowth}
        />

        <Metric
          icon={<Package size={20} />}
          title="Production"
          value={productionGrowth}
        />

        <Metric
          icon={<TrendingUp size={20} />}
          title="Profit"
          value={profitMargin}
        />

      </div>

    </div>

  );

}

function Metric({
  icon,
  title,
  value,
}: any) {

  return (

    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">

      <div className="flex items-center justify-between">

        <div className="text-amber-400">

          {icon}

        </div>

        <ArrowUpRight
          size={18}
          className="text-green-400"
        />

      </div>

      <p className="text-slate-400 mt-5 text-sm">

        {title}

      </p>

      <h3 className="text-3xl font-bold text-white mt-2">

        {value}%

      </h3>

    </div>

  );

}