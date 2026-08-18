"use client";

import {
  DollarSign,
  Wallet,
  ShoppingCart,
  Factory,
  Package,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";

import KPICard from "./KPICard";

export default function KPIGrid() {
  return (
    <section className="mt-8">

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <KPICard
          title="Today's Revenue"
          value="₦2,450,000"
          subtitle="Sales Generated Today"
          icon={<DollarSign size={30} />}
          color="bg-emerald-600"
          change={18.5}
        />

        <KPICard
          title="Today's Expenses"
          value="₦620,000"
          subtitle="Operating Cost"
          icon={<Wallet size={30} />}
          color="bg-red-500"
          change={-4.3}
        />

        <KPICard
          title="Orders Today"
          value="186"
          subtitle="Completed & Pending"
          icon={<ShoppingCart size={30} />}
          color="bg-blue-600"
          change={11.2}
        />

        <KPICard
          title="Production"
          value="9,540"
          subtitle="Loaves Produced"
          icon={<Factory size={30} />}
          color="bg-indigo-600"
          change={9.8}
        />

        <KPICard
          title="Flour Remaining"
          value="156 Bags"
          subtitle="Warehouse Stock"
          icon={<Package size={30} />}
          color="bg-amber-500"
          change={-6.1}
        />

        <KPICard
          title="Profit Today"
          value="₦1,830,000"
          subtitle="Net Profit"
          icon={<TrendingUp size={30} />}
          color="bg-green-600"
          change={22.4}
        />

        <KPICard
          title="Active Customers"
          value="428"
          subtitle="Returning Customers"
          icon={<Users size={30} />}
          color="bg-pink-600"
          change={15.7}
        />

        <KPICard
          title="Outstanding Debts"
          value="₦385,000"
          subtitle="Awaiting Payment"
          icon={<CreditCard size={30} />}
          color="bg-orange-600"
          change={-8.5}
        />

      </div>

    </section>
  );
}