"use client";

import {
  Users,
  UserPlus,
  ShoppingBag,
  Star,
} from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
}

interface Order {
  customer_id: string;
}

interface CustomerAnalyticsProps {
  customers: Customer[];
  orders: Order[];
}

export default function CustomerAnalytics({
  customers,
  orders,
}: CustomerAnalyticsProps) {
  const totalCustomers = customers.length;

  const activeCustomers = new Set(
    orders.map((o) => o.customer_id)
  ).size;

  const inactiveCustomers =
    totalCustomers - activeCustomers;

  const customerRetention =
    totalCustomers === 0
      ? 0
      : Math.round(
          (activeCustomers / totalCustomers) * 100
        );

  const averageOrders =
    totalCustomers === 0
      ? 0
      : (orders.length / totalCustomers).toFixed(1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Customer Analytics
          </h2>

          <p className="text-slate-400 mt-1">
            Customer engagement and business growth.
          </p>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Users className="text-white" />
        </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <Users className="text-blue-400" />

            <span className="text-blue-400">
              Customers
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {totalCustomers}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <ShoppingBag className="text-green-400" />

            <span className="text-green-400">
              Active
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {activeCustomers}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <UserPlus className="text-red-400" />

            <span className="text-red-400">
              Inactive
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {inactiveCustomers}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">

          <div className="flex justify-between">

            <Star className="text-amber-400" />

            <span className="text-amber-400">
              Avg Orders
            </span>

          </div>

          <h3 className="text-3xl font-bold text-white mt-4">
            {averageOrders}
          </h3>

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-slate-800 border border-slate-700 p-6">

        <div className="flex justify-between mb-3">

          <span className="text-slate-300">
            Customer Retention
          </span>

          <span className="text-white font-bold">
            {customerRetention}%
          </span>

        </div>

        <div className="w-full h-4 rounded-full bg-slate-700 overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{
              width: `${customerRetention}%`,
            }}
          />

        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div>

            <p className="text-slate-500 text-sm">
              Total Orders
            </p>

            <h4 className="text-2xl text-white font-bold mt-2">
              {orders.length}
            </h4>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Returning Customers
            </p>

            <h4 className="text-2xl text-green-400 font-bold mt-2">
              {activeCustomers}
            </h4>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Growth Status
            </p>

            <h4 className="text-2xl text-amber-400 font-bold mt-2">
              Excellent
            </h4>

          </div>

        </div>

      </div>

    </div>
  );
}