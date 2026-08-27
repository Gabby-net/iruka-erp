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
  Eye,
  X,
  CalendarDays,
  Phone,
  Hash,
  TrendingUp,
  Receipt,
  Clock,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type Customer = {
  id: string;
  full_name?: string | null;
  name?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

type Order = {
  id: string;
  customer_id?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  total_amount?: number | string | null;
  status?: string | null;
  created_at?: string | null;
};

type Sale = {
  id: string;
  customer_id?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  customer_phone?: string | null;
  total_amount?: number | string | null;
  created_at?: string | null;
};

type CustomerStats = {
  customer: Customer;
  customerId: string;
  name: string;
  phone: string;
  orders: number;
  revenue: number;
  firstOrder: string | null;
  lastOrder: string | null;
  recentOrders: Order[];
};

/* ============================================================
   HELPERS
============================================================ */

function formatMoney(amount: number) {
  return `₦${Number(amount || 0).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string | null) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanPhone(phone?: string | null) {
  return String(phone || "").replace(/\D/g, "");
}

function getCustomerName(customer: Customer) {
  return (
    customer.full_name ||
    customer.name ||
    customer.customer_name ||
    "Unknown Customer"
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function CustomersPage() {
  /* ==========================================================
     STATES
  ========================================================== */

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [sales, setSales] = useState<Sale[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerStats | null>(null);

  /* ==========================================================
     LOAD DATA
  ========================================================== */

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    try {
      const [customerRes, orderRes, salesRes] = await Promise.all([
        supabase
          .from("customers")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("orders")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("sales")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (customerRes.error) {
        console.error(
          "Customer loading error:",
          customerRes.error
        );
      }

      if (orderRes.error) {
        console.error(
          "Order loading error:",
          orderRes.error
        );
      }

      if (salesRes.error) {
        console.error(
          "Sales loading error:",
          salesRes.error
        );
      }

      setCustomers(customerRes.data || []);
      setOrders(orderRes.data || []);
      setSales(salesRes.data || []);
    } catch (error) {
      console.error(
        "Customer page loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     CUSTOMER ANALYTICS

     IMPORTANT:
     customers table is the SOURCE OF TRUTH.

     This page does NOT create customers.

     Customer registration happens from the Customer Orders
     workflow.

     Orders and sales only provide activity.
  ========================================================== */

  const customerStats = useMemo<CustomerStats[]>(() => {
    const stats: Record<string, CustomerStats> = {};

    /* --------------------------------------------------------
       REGISTERED CUSTOMERS
    -------------------------------------------------------- */

    customers.forEach((customer) => {
      if (!customer?.id) return;

      stats[customer.id] = {
        customer,

        customerId: customer.id,

        name: getCustomerName(customer),

        phone: customer.phone || "-",

        orders: 0,

        revenue: 0,

        firstOrder: null,

        lastOrder: null,

        recentOrders: [],
      };
    });

    /* --------------------------------------------------------
       FIND CUSTOMER

       Priority:
       1. customer_id
       2. phone
       3. name
    -------------------------------------------------------- */

    function findCustomerId(
      customerId?: string | null,
      name?: string | null,
      phone?: string | null
    ) {
      /* CUSTOMER ID */

      if (
        customerId &&
        stats[customerId]
      ) {
        return customerId;
      }

      /* PHONE */

      const normalizedPhone =
        cleanPhone(phone);

      if (normalizedPhone) {
        const found = Object.values(stats).find(
          (item) =>
            cleanPhone(item.phone) ===
            normalizedPhone
        );

        if (found) {
          return found.customerId;
        }
      }

      /* NAME */

      const normalizedName =
        String(name || "")
          .trim()
          .toLowerCase();

      if (normalizedName) {
        const found = Object.values(stats).find(
          (item) =>
            item.name
              .trim()
              .toLowerCase() ===
            normalizedName
        );

        if (found) {
          return found.customerId;
        }
      }

      return null;
    }

    /* --------------------------------------------------------
       ORDERS
    -------------------------------------------------------- */

    orders.forEach((order) => {
      const customerId =
        findCustomerId(
          order.customer_id,
          order.customer_name,
          order.phone
        );

      if (!customerId) return;

      const customer =
        stats[customerId];

      customer.orders += 1;

      customer.revenue += Number(
        order.total_amount || 0
      );

      if (order.created_at) {
        const orderDate =
          new Date(order.created_at);

        if (
          !customer.firstOrder ||
          orderDate <
            new Date(customer.firstOrder)
        ) {
          customer.firstOrder =
            order.created_at;
        }

        if (
          !customer.lastOrder ||
          orderDate >
            new Date(customer.lastOrder)
        ) {
          customer.lastOrder =
            order.created_at;
        }
      }

      customer.recentOrders.push(order);
    });

    /* --------------------------------------------------------
       SORT CUSTOMER ORDER HISTORY
    -------------------------------------------------------- */

    Object.values(stats).forEach(
      (customer) => {
        customer.recentOrders =
          customer.recentOrders
            .sort((a, b) => {
              const dateA = a.created_at
                ? new Date(a.created_at).getTime()
                : 0;

              const dateB = b.created_at
                ? new Date(b.created_at).getTime()
                : 0;

              return dateB - dateA;
            })
            .slice(0, 5);
      }
    );

    /* --------------------------------------------------------
       SALES

       Only attach sales when the customer has NO orders.

       This prevents the same customer transaction from being
       counted twice.
    -------------------------------------------------------- */

    sales.forEach((sale) => {
      const customerId =
        findCustomerId(
          sale.customer_id,
          sale.customer_name,
          sale.phone ||
            sale.customer_phone
        );

      if (!customerId) return;

      const customer =
        stats[customerId];

      /*
       * Orders are our primary customer purchase source.
       *
       * If this customer already has orders, don't add the
       * sale again as another purchase.
       */

      if (customer.orders === 0) {
        customer.orders += 1;

        customer.revenue += Number(
          sale.total_amount || 0
        );

        if (sale.created_at) {
          customer.firstOrder =
            sale.created_at;

          customer.lastOrder =
            sale.created_at;
        }
      }
    });

    return Object.values(stats);
  }, [
    customers,
    orders,
    sales,
  ]);

  /* ==========================================================
     LOADING SCREEN
  ========================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08111f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <h2 className="text-white text-2xl font-bold mt-6">
            Loading Customers...
          </h2>

          <p className="text-slate-500 mt-2">
            Loading customer intelligence
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     KPI CALCULATIONS
  ========================================================== */

  const totalCustomers =
    customerStats.length;

  const activeCustomers =
    customerStats.filter(
      (customer) =>
        customer.orders > 0
    ).length;

  const returningCustomers =
    customerStats.filter(
      (customer) =>
        customer.orders > 1
    ).length;

  const lifetimeRevenue =
    customerStats.reduce(
      (sum, customer) =>
        sum +
        Number(
          customer.revenue || 0
        ),
      0
    );

  const totalOrders =
    customerStats.reduce(
      (sum, customer) =>
        sum +
        Number(
          customer.orders || 0
        ),
      0
    );

  const averageOrderValue =
    totalOrders === 0
      ? 0
      : lifetimeRevenue /
        totalOrders;

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const newCustomers =
    customers.filter((customer) => {
      if (!customer.created_at) {
        return false;
      }

      const joined =
        new Date(customer.created_at);

      return (
        joined.getMonth() ===
          currentMonth &&
        joined.getFullYear() ===
          currentYear
      );
    }).length;

  const topCustomer =
    [...customerStats].sort(
      (a, b) =>
        b.revenue -
        a.revenue
    )[0];

/* ==========================================================
   CUSTOMER SEARCH / FILTER
========================================================== */

const searchText = search.trim().toLowerCase();

const filteredCustomers = customerStats.filter((customer) => {
  if (!searchText) {
    return true;
  }

  const name = String(customer.name || "").toLowerCase();
  const phone = String(customer.phone || "").toLowerCase();
  const customerId = String(customer.customerId || "").toLowerCase();

  return (
    name.includes(searchText) ||
    phone.includes(searchText) ||
    customerId.includes(searchText)
  );
});

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <ProtectedRoute
      allowedRoles={["admin"]}
    >
      <div className="min-h-screen bg-[#08111f] -m-6 p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

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

        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          {/* TOTAL */}

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

          {/* ACTIVE */}

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

          {/* NEW */}

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

          {/* RETURNING */}

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

          {/* REVENUE */}

          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>
                <p className="text-emerald-300">
                  Lifetime Revenue
                </p>

                <h2 className="text-4xl font-black text-white mt-4">
                  {formatMoney(
                    lifetimeRevenue
                  )}
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

          {/* AVERAGE */}

          <div className="bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-700 rounded-3xl p-7 shadow-2xl">

            <div className="flex justify-between">

              <div>
                <p className="text-cyan-300">
                  Average Order
                </p>

                <h2 className="text-4xl font-black text-white mt-4">
                  {formatMoney(
                    averageOrderValue
                  )}
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

        {/* ==================================================
            SEARCH + TOP CUSTOMER
        ================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          <div className="xl:col-span-2 relative">

            <Search
              className="absolute left-5 top-4 text-slate-500"
              size={22}
            />

            <input
              type="text"
              placeholder="Search customer by name, phone or customer ID..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
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
              {formatMoney(
                topCustomer?.revenue ||
                  0
              )}
            </p>

          </div>

        </div>

        {/* ==================================================
            CUSTOMER TABLE
        ================================================== */}

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

                  <th className="text-right px-6 py-4 text-slate-300">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-14 text-slate-400"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}

                {filteredCustomers.map(
                  (item) => {
                    const revenue =
                      Number(
                        item.revenue ||
                          0
                      );

                    const vip =
                      revenue >=
                      100000;

                    return (
                      <tr
                        key={
                          item.customerId
                        }
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                              {item.name
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="text-white font-semibold">
                                {item.name}
                              </p>

                              <p className="text-slate-500 text-xs mt-1">
                                ID:{" "}
                                {
                                  item.customerId
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-5 text-slate-300">
                          {item.phone}
                        </td>

                        {/* ORDERS */}

                        <td className="px-6 py-5">
                          <span className="text-white font-bold">
                            {item.orders}
                          </span>
                        </td>

                        {/* REVENUE */}

                        <td className="px-6 py-5 text-green-400 font-bold">
                          {formatMoney(
                            revenue
                          )}
                        </td>

                        {/* LAST ORDER */}

                        <td className="px-6 py-5 text-slate-300">
                          {formatDate(
                            item.lastOrder
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          {vip ? (
                            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                              VIP
                            </span>
                          ) : item.orders >
                            0 ? (
                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                              New
                            </span>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          <button
                            onClick={() =>
                              setSelectedCustomer(
                                item
                              )
                            }
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold transition"
                          >
                            <Eye
                              size={17}
                            />

                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ==================================================
            CUSTOMER DETAIL MODAL
        ================================================== */}

        {selectedCustomer && (
          <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() =>
              setSelectedCustomer(
                null
              )
            }
          >

            <div
              className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0b1626] border border-slate-700 rounded-3xl shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 bg-[#0b1626]/95 backdrop-blur border-b border-slate-700 px-7 py-6">

                <div className="flex justify-between items-start gap-5">

                  <div className="flex items-center gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-black text-2xl font-black">
                      {selectedCustomer.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
                        Customer Profile
                      </p>

                      <h2 className="text-3xl font-black text-white mt-1">
                        {
                          selectedCustomer.name
                        }
                      </h2>

                      <p className="text-slate-400 mt-1">
                        Customer ID:{" "}
                        {
                          selectedCustomer.customerId
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedCustomer(
                        null
                      )
                    }
                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
                  >
                    <X
                      size={22}
                    />
                  </button>

                </div>

              </div>

              <div className="p-7">

                {/* ==================================================
                    BASIC CUSTOMER DETAILS
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

                  {/* NAME */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <Users
                        size={18}
                      />

                      <span className="text-sm">
                        Customer Name
                      </span>
                    </div>

                    <p className="text-white font-bold text-lg">
                      {
                        selectedCustomer.name
                      }
                    </p>

                  </div>

                  {/* PHONE */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <Phone
                        size={18}
                      />

                      <span className="text-sm">
                        Phone Number
                      </span>
                    </div>

                    <p className="text-white font-bold text-lg">
                      {
                        selectedCustomer.phone
                      }
                    </p>

                  </div>

                  {/* CUSTOMER ID */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <Hash
                        size={18}
                      />

                      <span className="text-sm">
                        Customer ID
                      </span>
                    </div>

                    <p className="text-yellow-400 font-bold text-sm break-all">
                      {
                        selectedCustomer.customerId
                      }
                    </p>

                  </div>

                  {/* REGISTERED */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                      <CalendarDays
                        size={18}
                      />

                      <span className="text-sm">
                        Date Registered
                      </span>
                    </div>

                    <p className="text-white font-bold text-lg">
                      {formatDate(
                        selectedCustomer
                          .customer
                          .created_at
                      )}
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    CUSTOMER FINANCIAL / ORDER SUMMARY
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

                  {/* TOTAL ORDERS */}

                  <div className="bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-blue-300 mb-3">
                      <Receipt
                        size={20}
                      />

                      <span className="text-sm">
                        Total Orders
                      </span>
                    </div>

                    <p className="text-white text-3xl font-black">
                      {
                        selectedCustomer.orders
                      }
                    </p>

                    <p className="text-blue-300 text-xs mt-2">
                      Since registration
                    </p>

                  </div>

                  {/* TOTAL REVENUE */}

                  <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-emerald-300 mb-3">
                      <DollarSign
                        size={20}
                      />

                      <span className="text-sm">
                        Total Revenue
                      </span>
                    </div>

                    <p className="text-white text-3xl font-black">
                      {formatMoney(
                        selectedCustomer.revenue
                      )}
                    </p>

                  </div>

                  {/* AVERAGE */}

                  <div className="bg-gradient-to-br from-cyan-900/60 to-slate-900 border border-cyan-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-cyan-300 mb-3">
                      <TrendingUp
                        size={20}
                      />

                      <span className="text-sm">
                        Average Order Value
                      </span>
                    </div>

                    <p className="text-white text-3xl font-black">

                      {formatMoney(
                        selectedCustomer
                          .orders === 0
                          ? 0
                          : selectedCustomer.revenue /
                              selectedCustomer.orders
                      )}

                    </p>

                  </div>

                  {/* TOTAL SPENDING */}

                  <div className="bg-gradient-to-br from-yellow-900/60 to-slate-900 border border-yellow-700 rounded-2xl p-5">

                    <div className="flex items-center gap-3 text-yellow-300 mb-3">
                      <ShoppingBag
                        size={20}
                      />

                      <span className="text-sm">
                        Customer's Total Spending
                      </span>
                    </div>

                    <p className="text-white text-3xl font-black">
                      {formatMoney(
                        selectedCustomer.revenue
                      )}
                    </p>

                    <p className="text-yellow-300 text-xs mt-2">
                      Lifetime customer value
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    ORDER TIMELINE
                ================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                  {/* FIRST ORDER */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">

                      <Clock
                        size={19}
                      />

                      <span className="text-sm">
                        First Order Date
                      </span>

                    </div>

                    <p className="text-white text-xl font-bold">
                      {formatDateTime(
                        selectedCustomer.firstOrder
                      )}
                    </p>

                  </div>

                  {/* MOST RECENT */}

                  <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

                    <div className="flex items-center gap-3 text-slate-400 mb-3">

                      <CalendarDays
                        size={19}
                      />

                      <span className="text-sm">
                        Most Recent Order Date
                      </span>

                    </div>

                    <p className="text-white text-xl font-bold">
                      {formatDateTime(
                        selectedCustomer.lastOrder
                      )}
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    ORDER HISTORY
                ================================================== */}

                <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">

                  <div className="px-6 py-5 border-b border-slate-700">

                    <div className="flex items-center gap-3">

                      <Receipt
                        size={21}
                        className="text-yellow-400"
                      />

                      <div>

                        <h3 className="text-xl font-bold text-white">
                          Recent Order History
                        </h3>

                        <p className="text-slate-400 text-sm mt-1">
                          Showing the latest 5 orders
                        </p>

                      </div>

                    </div>

                  </div>

                  {selectedCustomer
                    .recentOrders
                    .length === 0 ? (

                    <div className="py-12 text-center">

                      <ShoppingBag
                        size={38}
                        className="mx-auto text-slate-600"
                      />

                      <p className="text-slate-400 mt-4">
                        No order history yet.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="min-w-full">

                        <thead className="bg-slate-800">

                          <tr>

                            <th className="text-left px-6 py-4 text-slate-300">
                              Order Date
                            </th>

                            <th className="text-left px-6 py-4 text-slate-300">
                              Order Amount
                            </th>

                            <th className="text-left px-6 py-4 text-slate-300">
                              Order Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {selectedCustomer
                            .recentOrders
                            .map(
                              (
                                order,
                                index
                              ) => (

                                <tr
                                  key={
                                    order.id ||
                                    index
                                  }
                                  className="border-b border-slate-800"
                                >

                                  <td className="px-6 py-5 text-slate-300">

                                    {formatDateTime(
                                      order.created_at
                                    )}

                                  </td>

                                  <td className="px-6 py-5 text-green-400 font-bold">

                                    {formatMoney(
                                      Number(
                                        order.total_amount ||
                                          0
                                      )
                                    )}

                                  </td>

                                  <td className="px-6 py-5">

                                    <span
                                      className={`
                                        inline-flex
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-bold
                                        ${
                                          String(
                                            order.status ||
                                              "Pending"
                                          )
                                            .toLowerCase()
                                            .includes(
                                              "complete"
                                            )
                                            ? "bg-green-500/20 text-green-300"
                                            : String(
                                                order.status ||
                                                  "Pending"
                                              )
                                                  .toLowerCase()
                                                  .includes(
                                                    "cancel"
                                                  )
                                              ? "bg-red-500/20 text-red-300"
                                              : "bg-yellow-500/20 text-yellow-300"
                                        }
                                      `}
                                    >
                                      {order.status ||
                                        "Pending"}
                                    </span>

                                  </td>

                                </tr>

                              )
                            )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}