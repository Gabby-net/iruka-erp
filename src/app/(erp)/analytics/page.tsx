"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import ExecutiveHeader from "@/components/analytics/ExecutiveHeader";
import ExecutiveCards from "@/components/analytics/ExecutiveCards";
import FinancialHealth from "@/components/analytics/FinancialHealth";
import InventoryHealth from "@/components/analytics/InventoryHealth";
import CustomerAnalytics from "@/components/analytics/CustomerAnalytics";
import BestSellingProducts from "@/components/analytics/BestSellingProducts";
import TopCustomers from "@/components/analytics/TopCustomers";
import CEOActionCenter from "@/components/analytics/CEOActionCenter";
import BusinessGrowthIndex from "@/components/analytics/BusinessGrowthIndex";
import AIBusinessForecast from "@/components/analytics/AIBusinessForecast";

import RevenueChart from "@/components/analytics/RevenueChart";
import ProductionChart from "@/components/analytics/ProductionChart";
import SalesChart from "@/components/analytics/SalesChart";
import CustomerGrowthChart from "@/components/analytics/CustomerGrowthChart";
import InventoryChart from "@/components/analytics/InventoryChart";

type Period = "today" | "week" | "month" | "year";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("today");

  const [loading, setLoading] = useState(true);

  const [sales, setSales] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [production, setProduction] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);

useEffect(() => {
  fetchAnalytics();
}, [period]);

  async function fetchAnalytics() {
    setLoading(true);
    let startDate = new Date();

switch (period) {
  case "today":
    startDate.setHours(0, 0, 0, 0);
    break;

  case "week":
    startDate.setDate(startDate.getDate() - 7);
    break;

  case "month":
    startDate.setMonth(startDate.getMonth() - 1);
    break;

  case "year":
    startDate.setFullYear(startDate.getFullYear() - 1);
    break;
}

const fromDate = startDate.toISOString();

const [
  salesRes,
  ordersRes,
  customersRes,
  productsRes,
  productionRes,
  inventoryRes,
  financeRes,
] = await Promise.all([
supabase
  .from("sales")
  .select("*")
  .gte("created_at", fromDate)
  .order("created_at", { ascending: false }),

supabase
  .from("orders")
  .select("*")
  .gte("created_at", fromDate)
  .order("created_at", { ascending: false }),

supabase
  .from("customers")
  .select("*")
  .gte("created_at", fromDate)
  .order("created_at", { ascending: false }),

  supabase
    .from("products")
    .select("*"),

supabase
  .from("production_logs")
  .select("*")
  .gte("created_at", fromDate)
  .order("created_at", { ascending: false }),

supabase
  .from("inventory")
  .select("*"),

supabase
  .from("finance_transactions")
  .select("*")
  .gte("created_at", fromDate)
  .order("created_at", { ascending: false }),
]);

    setSales(salesRes.data || []);
    setOrders(ordersRes.data || []);
    setCustomers(customersRes.data || []);
    setProducts(productsRes.data || []);
    setProduction(productionRes.data || []);
    setInventory(inventoryRes.data || []);
    setFinance(financeRes.data || []);

    if (salesRes.error) console.error("Sales:", salesRes.error);

if (ordersRes.error) console.error("Orders:", ordersRes.error);

if (customersRes.error) console.error("Customers:", customersRes.error);

if (productsRes.error) console.error("Products:", productsRes.error);

if (productionRes.error) console.error("Production:", productionRes.error);

if (inventoryRes.error) console.error("Inventory:", inventoryRes.error);

if (financeRes.error) console.error("Finance:", financeRes.error);

    setLoading(false);
  }

const totalRevenue = useMemo(() => {
  return sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount || 0),
    0
  );
}, [sales]);

  const totalExpenses = useMemo(() => {
    return finance
      .filter((x) => x.type === "expense")
      .reduce((a, b) => a + Number(b.amount || 0), 0);
  }, [finance]);

  const totalProfit = totalRevenue - totalExpenses;

  const totalOrders = useMemo(() => {
  return orders.length;
}, [orders]);

  const totalCustomers = useMemo(() => {
  return customers.length;
}, [customers]);

  const totalProducts = useMemo(() => {
  return products.length;
}, [products]);

const totalProduction = useMemo(() => {
  const today = new Date().toISOString().split("T")[0];

  return production
    .filter((item) => item.production_date === today)
    .reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
}, [production]);

const inventoryValue = useMemo(() => {
  return inventory.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
      Number(item.unit_cost || 0),
    0
  );
}, [inventory]);

const lowStockItems = useMemo(() => {
  return inventory.filter(
    (item) =>
      Number(item.quantity || 0) <=
      Number(item.reorder_level || 0)
  ).length;
}, [inventory]);
const revenueChartData = useMemo(() => {

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return months.map((month, index) => {

    const monthSales = sales.filter((sale: any) => {

      if (!sale.created_at) return false;

      return new Date(sale.created_at).getMonth() === index;

    });

    const monthExpenses = finance.filter((item: any) => {

      if (!item.created_at) return false;

      return (
        item.type?.toLowerCase() === "expense" &&
        new Date(item.created_at).getMonth() === index
      );

    });

    const revenue = monthSales.reduce(

      (sum, sale) => sum + Number(sale.total_amount || 0),

      0

    );

    const expenses = monthExpenses.reduce(

      (sum, item) => sum + Number(item.amount || 0),

      0

    );

    return {

      name: month,

      revenue,

      expenses,

      profit: revenue - expenses,

    };

  });

}, [sales, finance]);

const productionChartData = useMemo(() => {
  return production.map((item: any) => ({
    product: item.bread,
    produced: Number(item.quantity || 0),
    waste: Number(item.waste_quantity || 0),
  }));
}, [production]);

  const salesChartData = useMemo(() => {
    return sales.map((item: any) => ({
      product: item.product_name,
      quantity: Number(item.quantity || 0),
      revenue: Number(item.total_amount || 0),
    }));
  }, [sales]);

const customerPerformanceChartData = useMemo(() => {

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => {

    const monthOrders = orders.filter((order: any) => {

      if (!order.created_at) return false;

      return new Date(order.created_at).getMonth() === index;

    });

    return {

      month,

      orders: monthOrders.length,

    };

  });

}, [orders]);

const inventoryChartData = useMemo(() => {
  return inventory.map((item: any) => ({
    name: item.material_name || item.name,
    value: Number(item.current_stock || item.quantity || 0),
  }));
}, [inventory]);

  const bestSellingProducts = useMemo(() => {
    const grouped: Record<
      string,
      {
        quantity: number;
        revenue: number;
      }
    > = {};

    sales.forEach((sale: any) => {
      const product = sale.product_name;

      if (!grouped[product]) {
        grouped[product] = {
          quantity: 0,
          revenue: 0,
        };
      }

      grouped[product].quantity += Number(
        sale.quantity || 0
      );

      grouped[product].revenue += Number(
        sale.total_amount || 0
      );
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        quantity: value.quantity,
        revenue: value.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales]);

  const topCustomers = useMemo(() => {
    const grouped: Record<
      string,
      {
        orders: number;
        spent: number;
      }
    > = {};

    sales.forEach((sale: any) => {
      const customer =
        sale.customer_name || "Walk-in";

      if (!grouped[customer]) {
        grouped[customer] = {
          orders: 0,
          spent: 0,
        };
      }

      grouped[customer].orders++;

      grouped[customer].spent += Number(
        sale.total_amount || 0
      );
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        orders: value.orders,
        spent: value.spent,
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
  }, [sales]);

  const businessGrowth = useMemo(() => {

  const revenueGrowth =
    totalRevenue > 0
      ? Math.min(
          100,
          Math.round((totalRevenue / 1000000) * 10)
        )
      : 0;

  const salesGrowth =
    sales.length > 0
      ? Math.min(100, sales.length * 2)
      : 0;

  const customerGrowth =
    customers.length > 0
      ? Math.min(100, customers.length * 3)
      : 0;

  const productionGrowth =
    production.length > 0
      ? Math.min(100, production.length * 2)
      : 0;

  const profitMargin =
    totalRevenue > 0
      ? Math.round(
          (totalProfit / totalRevenue) * 100
        )
      : 0;

  return {

    revenueGrowth,

    salesGrowth,

    customerGrowth,

    productionGrowth,

    profitMargin,

  };

}, [
  totalRevenue,
  totalProfit,
  sales,
  customers,
  production,
]);

const bestSellingProductName =
  bestSellingProducts.length > 0
    ? bestSellingProducts[0].name
    : "No sales yet";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading Analytics...
      </div>
    );
  }
    return (
    <div className="min-h-screen bg-slate-950 p-6">

      <ExecutiveHeader
        period={period}
        setPeriod={setPeriod}
        onRefresh={fetchAnalytics}
      />

      <ExecutiveCards
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        totalExpenses={totalExpenses}
        totalOrders={totalOrders}
        totalCustomers={totalCustomers}
        totalProducts={totalProducts}
        totalProduction={totalProduction}
        inventoryValue={inventoryValue}
      />

<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

  <BusinessGrowthIndex
    revenueGrowth={businessGrowth.revenueGrowth}
    salesGrowth={businessGrowth.salesGrowth}
    customerGrowth={businessGrowth.customerGrowth}
    productionGrowth={businessGrowth.productionGrowth}
    profitMargin={businessGrowth.profitMargin}
  />

  <AIBusinessForecast
    revenue={totalRevenue}
    expenses={totalExpenses}
    profit={totalProfit}
    orders={totalOrders}
    customers={totalCustomers}
    lowStockItems={lowStockItems}
    bestSellingProduct={bestSellingProductName}
  />

</div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RevenueChart
          data={revenueChartData}
        />

        <ProductionChart
          data={productionChartData}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <SalesChart
          data={salesChartData}
        />

<CustomerGrowthChart
  data={customerPerformanceChartData}
/>

      </div>

      <div className="mt-8">

<InventoryChart
  data={inventoryChartData}
/>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <BestSellingProducts
          products={bestSellingProducts}
        />

        <TopCustomers
          customers={topCustomers}
        />

      </div>

      <div className="mt-8">

        <CustomerAnalytics
          customers={customers}
          orders={orders}
        />

      </div>

      <div className="mt-8">

        <CEOActionCenter
          revenue={totalRevenue}
          expenses={totalExpenses}
          profit={totalProfit}
          lowStockItems={lowStockItems}
          totalCustomers={totalCustomers}
          totalOrders={totalOrders}
        />

      </div>

    </div>
  );
}