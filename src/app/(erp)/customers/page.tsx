"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

import ProtectedRoute from "@/components/ProtectedRoute";

import Image from "next/image";

import {
  Users,
  UserCheck,
  UserPlus,
  Repeat,
  DollarSign,
  ShoppingBag,
  Search,
} from "lucide-react";

export default function CustomersPage() {

  /* ==================================================
                    STATES
  ================================================== */

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState<any[]>([]);

  const [orders, setOrders] = useState<any[]>([]);

  const [sales, setSales] = useState<any[]>([]);

  /* ==================================================
                LOAD EVERYTHING
  ================================================== */

  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    setLoading(true);

    try {

      const [

        customerRes,

        orderRes,

        salesRes,

      ] = await Promise.all([

        supabase

          .from("customers")

          .select("*")

          .order("created_at", {

            ascending: false,

          }),

        supabase

          .from("orders")

          .select("*"),

        supabase

          .from("sales")

          .select("*"),

      ]);

      setCustomers(customerRes.data || []);

      setOrders(orderRes.data || []);

      setSales(salesRes.data || []);

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  }

  /* ==================================================
            CUSTOMER PERFORMANCE MAP
  ================================================== */

  const customerStats = useMemo(() => {

    const stats: Record<string, any> = {};

    customers.forEach((customer) => {

      const name =
        customer.full_name ||
        customer.name ||
        customer.customer_name;

      if (!name) return;

      stats[name] = {

        customer,

        orders: 0,

        revenue: 0,

        lastOrder: null,

      };

    });

    sales.forEach((sale) => {

      const customerName =
        sale.customer_name;

      if (!customerName) return;

      if (!stats[customerName]) {

        stats[customerName] = {

          customer: null,

          orders: 0,

          revenue: 0,

          lastOrder: null,

        };

      }

      stats[customerName].orders++;

      stats[customerName].revenue += Number(

        sale.total_amount || 0

      );

      if (

        !stats[customerName].lastOrder ||

        new Date(sale.created_at) >

          new Date(stats[customerName].lastOrder)

      ) {

        stats[customerName].lastOrder =

          sale.created_at;

      }

    });

    return Object.values(stats);

  }, [customers, sales]);

  /* ==================================================
                  LOADING SCREEN
  ================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-[#08111f] flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h2 className="text-white text-2xl font-bold mt-6">

            Loading Customers...

          </h2>

        </div>

      </div>

    );

  }

    /* ==================================================
                LIVE CUSTOMER ANALYTICS
  ================================================== */

  const totalCustomers = customers.length;

  const activeCustomers = customerStats.filter(
    (customer) => customer.orders > 0
  ).length;

  const returningCustomers = customerStats.filter(
    (customer) => customer.orders > 1
  ).length;

  const vipCustomers = customerStats.filter(
    (customer) => customer.revenue >= 100000
  ).length;

  const lifetimeRevenue = customerStats.reduce(
    (sum, customer) =>
      sum + Number(customer.revenue || 0),
    0
  );

  const totalOrders = customerStats.reduce(
    (sum, customer) =>
      sum + Number(customer.orders || 0),
    0
  );

  const averageOrderValue =
    totalOrders === 0
      ? 0
      : lifetimeRevenue / totalOrders;

  const currentMonth = new Date().getMonth();

  const currentYear = new Date().getFullYear();

  const newCustomers = customers.filter((customer) => {

    if (!customer.created_at) return false;

    const joined = new Date(customer.created_at);

    return (
      joined.getMonth() === currentMonth &&
      joined.getFullYear() === currentYear
    );

  }).length;

  const topCustomer = [...customerStats].sort(
    (a, b) => b.revenue - a.revenue
  )[0];

  const filteredCustomers = customerStats.filter(
    (customer) => {

      const customerName =
        customer.customer?.full_name ||
        customer.customer?.name ||
        customer.customer?.customer_name ||
        "";

      const phone =
        customer.customer?.phone ||
        "";

      return (
        customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        phone
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }
  );

    return (

    <ProtectedRoute
      allowedRoles={["admin"]}
    >

      <div className="min-h-screen bg-[#08111f] -m-6 p-8">

        {/* ==========================================
                    HEADER
        ========================================== */}

        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-8 mb-10">

          <div className="flex items-center gap-6">

            <Image
              src="/logo/nkiruka-logo.png"
              alt="NKIRUKA"
              width={90}
              height={90}
              priority
            />

            <div>

              <h1 className="text-5xl font-black text-white">

                Customer Intelligence

              </h1>

              <p className="text-slate-400 text-xl mt-2">

                Customer Relationships & Business Insights

              </p>

              <p className="text-slate-500 mt-1">

                Live customer analytics from Orders & Sales

              </p>

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl px-8 py-6 shadow-2xl">

            <p className="text-slate-400">

              Today

            </p>

            <h2 className="text-white text-2xl font-bold mt-2">

              {new Date().toLocaleDateString(
                "en-GB",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}

            </h2>

            <p className="text-yellow-400 mt-3 font-semibold">

              Customer Intelligence Center

            </p>

          </div>

        </div>

        {/* ==========================================
                    KPI CARDS
        ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          {/* Total Customers */}

          <div className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-blue-300">

                  Total Customers

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  {totalCustomers}

                </h2>

                <p className="text-blue-200 mt-3">

                  Registered Customers

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">

                <Users
                  size={34}
                  className="text-blue-400"
                />

              </div>

            </div>

          </div>

          {/* Active */}

          <div className="bg-gradient-to-br from-green-900 to-slate-900 border border-green-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-green-300">

                  Active Customers

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  {activeCustomers}

                </h2>

                <p className="text-green-200 mt-3">

                  Purchased At Least Once

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">

                <UserCheck
                  size={34}
                  className="text-green-400"
                />

              </div>

            </div>

          </div>

          {/* New */}

          <div className="bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-purple-300">

                  New Customers

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  {newCustomers}

                </h2>

                <p className="text-purple-200 mt-3">

                  Joined This Month

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">

                <UserPlus
                  size={34}
                  className="text-purple-400"
                />

              </div>

            </div>

          </div>

          {/* Returning */}

          <div className="bg-gradient-to-br from-orange-900 to-slate-900 border border-orange-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-orange-300">

                  Returning Customers

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  {returningCustomers}

                </h2>

                <p className="text-orange-200 mt-3">

                  Loyal Customers

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">

                <Repeat
                  size={34}
                  className="text-orange-400"
                />

              </div>

            </div>

          </div>

          {/* Revenue */}

          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-emerald-300">

                  Lifetime Revenue

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  ₦{lifetimeRevenue.toLocaleString()}

                </h2>

                <p className="text-emerald-200 mt-3">

                  Customer Purchases

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">

                <DollarSign
                  size={34}
                  className="text-emerald-400"
                />

              </div>

            </div>

          </div>

          {/* Average */}

          <div className="bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>

                <p className="text-cyan-300">

                  Average Order

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  ₦{averageOrderValue.toLocaleString(undefined,{
                    maximumFractionDigits:0,
                  })}

                </h2>

                <p className="text-cyan-200 mt-3">

                  Per Purchase

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">

                <ShoppingBag
                  size={34}
                  className="text-cyan-400"
                />

              </div>

            </div>

          </div>

        </div>

                {/* ==========================================
                SEARCH + TOP CUSTOMER
        ========================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          <div className="xl:col-span-2 relative">

            <Search
              className="absolute left-5 top-4 text-slate-500"
              size={22}
            />

            <input
              type="text"
              placeholder="Search customer by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500"
            />

          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-2xl p-5 shadow-xl">

            <p className="text-yellow-100 text-sm">

              TOP CUSTOMER

            </p>

            <h2 className="text-white text-2xl font-black mt-2">

              {topCustomer?.customer?.full_name ||
                topCustomer?.customer?.name ||
                "No Customer"}

            </h2>

            <p className="text-yellow-50 mt-2">

              ₦
              {Number(
                topCustomer?.revenue || 0
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* ==========================================
                    CUSTOMER TABLE
        ========================================== */}

        <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

          <div className="px-8 py-6 border-b border-slate-700">

            <h2 className="text-2xl font-bold text-white">

              Customer Directory

            </h2>

            <p className="text-slate-400 mt-1">

              Registered customers with lifetime analytics

            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-800">

                <tr>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Orders
                  </th>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Revenue
                  </th>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Last Order
                  </th>

                  <th className="text-left px-6 py-4 text-slate-300">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-14 text-slate-400"
                    >

                      No customers found.

                    </td>

                  </tr>

                )}

                {filteredCustomers.map((item: any, index: number) => {

                  const customer = item.customer;

                  const name =
                    customer?.full_name ||
                    customer?.name ||
                    "Unknown";

                  const phone =
                    customer?.phone || "-";

                  const revenue =
                    Number(item.revenue || 0);

                  const vip =
                    revenue >= 100000;

                  return (

                    <tr
                      key={index}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">

                            {name.charAt(0).toUpperCase()}

                          </div>

                          <div>

                            <p className="text-white font-semibold">

                              {name}

                            </p>

                            <p className="text-slate-400 text-sm">

                              {customer?.email || "-"}

                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {phone}

                      </td>

                      <td className="px-6 py-5">

                        <span className="text-white font-bold">

                          {item.orders}

                        </span>

                      </td>

                      <td className="px-6 py-5 text-green-400 font-bold">

                        ₦{revenue.toLocaleString()}

                      </td>

                      <td className="px-6 py-5 text-slate-300">

                        {item.lastOrder
                          ? new Date(
                              item.lastOrder
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      <td className="px-6 py-5">

                        {vip ? (

                          <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold">

                            VIP

                          </span>

                        ) : item.orders > 0 ? (

                          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">

                            Active

                          </span>

                        ) : (

                          <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">

                            New

                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </ProtectedRoute>

  );

}