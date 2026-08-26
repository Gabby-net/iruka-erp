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
        REAL CUSTOMER PERFORMANCE MAP
        SOURCE:
        customers + orders + sales
================================================== */

const customerStats = useMemo(() => {

  const stats: Record<string, any> = {};

  /*
   * Create a reliable customer key.
   *
   * PHONE is preferred because names can be duplicated.
   * If there is no phone, use normalized customer name.
   */
  function getCustomerKey(
    name?: string | null,
    phone?: string | null
  ) {

    const cleanPhone =
      String(phone || "")
        .replace(/\D/g, "");

    if (cleanPhone) {
      return `phone:${cleanPhone}`;
    }

    const cleanName =
      String(name || "")
        .trim()
        .toLowerCase();

    if (cleanName) {
      return `name:${cleanName}`;
    }

    return null;
  }

  /*
   * CREATE CUSTOMER RECORD
   */
  function ensureCustomer(
    name?: string | null,
    phone?: string | null,
    customerData?: any
  ) {

    const key =
      getCustomerKey(name, phone);

    if (!key) return null;

    if (!stats[key]) {

      stats[key] = {

        customer:
          customerData || null,

        name:
          name || "Unknown Customer",

        phone:
          phone || "-",

        email:
          customerData?.email || "-",

        orders: 0,

        revenue: 0,

        lastOrder: null,

        lastSale: null,

      };

    } else {

      /*
       * Fill missing information
       */
      if (
        (!stats[key].name ||
          stats[key].name === "Unknown Customer") &&
        name
      ) {

        stats[key].name = name;

      }

      if (
        (!stats[key].phone ||
          stats[key].phone === "-") &&
        phone
      ) {

        stats[key].phone = phone;

      }

      if (
        (!stats[key].email ||
          stats[key].email === "-") &&
        customerData?.email
      ) {

        stats[key].email =
          customerData.email;

      }

      if (
        !stats[key].customer &&
        customerData
      ) {

        stats[key].customer =
          customerData;

      }

    }

    return key;

  }

  /* ==================================================
                1. REGISTERED CUSTOMERS
  ================================================== */

  customers.forEach((customer) => {

    const name =
      customer.full_name ||
      customer.name ||
      customer.customer_name;

    const phone =
      customer.phone || "";

    ensureCustomer(
      name,
      phone,
      customer
    );

  });

  /* ==================================================
                2. CUSTOMER ORDERS
  ================================================== */

  orders.forEach((order) => {

    const name =
      order.customer_name ||
      "Unknown Customer";

    const phone =
      order.phone || "";

    const key =
      ensureCustomer(
        name,
        phone
      );

    if (!key) return;

    /*
     * Count real orders
     */
    stats[key].orders++;

    /*
     * Use order total as customer revenue
     *
     * This gives us the value of actual
     * customer orders.
     */
    stats[key].revenue +=
      Number(
        order.total_amount || 0
      );

    /*
     * Track latest order
     */
    if (
      order.created_at &&
      (
        !stats[key].lastOrder ||
        new Date(order.created_at) >
          new Date(stats[key].lastOrder)
      )
    ) {

      stats[key].lastOrder =
        order.created_at;

    }

  });

  /* ==================================================
                3. SALES
  ================================================== */

  sales.forEach((sale) => {

    const name =
      sale.customer_name ||
      "Unknown Customer";

    /*
     * sales may or may not have phone
     */
    const phone =
      sale.phone ||
      sale.customer_phone ||
      "";

    const key =
      ensureCustomer(
        name,
        phone
      );

    if (!key) return;

    /*
     * Only use sales to calculate revenue
     * if there are no orders for this customer.
     *
     * This prevents counting the same customer
     * transaction twice.
     */

    if (
      !orders.some(
        (order) => {

          const orderKey =
            getCustomerKey(
              order.customer_name,
              order.phone
            );

          return orderKey === key;

        }
      )
    ) {

      stats[key].orders++;

      stats[key].revenue +=
        Number(
          sale.total_amount || 0
        );

    }

    /*
     * Track latest sale
     */
    if (
      sale.created_at &&
      (
        !stats[key].lastSale ||
        new Date(sale.created_at) >
          new Date(stats[key].lastSale)
      )
    ) {

      stats[key].lastSale =
        sale.created_at;

    }

    /*
     * Use latest sale if it is
     * newer than latest order
     */
    if (
      sale.created_at &&
      (
        !stats[key].lastOrder ||
        new Date(sale.created_at) >
          new Date(stats[key].lastOrder)
      )
    ) {

      stats[key].lastOrder =
        sale.created_at;

    }

  });

  return Object.values(stats);

}, [
  customers,
  orders,
  sales
]);

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
      customer.name || "";

    const phone =
      customer.phone || "";

    const email =
      customer.email || "";

    const searchText =
      search.toLowerCase();

    return (
      customerName
        .toLowerCase()
        .includes(searchText) ||

      phone
        .toLowerCase()
        .includes(searchText) ||

      email
        .toLowerCase()
        .includes(searchText)
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

{topCustomer?.name ||
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

  const name =
    item.name ||
    "Unknown Customer";

  const phone =
    item.phone ||
    "-";

  const email =
    item.email ||
    "-";

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

  {email}

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