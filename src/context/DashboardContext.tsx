"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type DashboardContextType = {
  sales: any[];
  products: any[];
  production: any[];
  inventory: any[];
  expenses: any[];
  debtors: any[];

  revenue: number;
  totalExpenses: number;
  totalDebts: number;
  flourBags: number;
  totalProduction: number;
  totalSales: number;
  lowStock: number;

  refresh: () => Promise<void>;
};

const DashboardContext =
  createContext({} as DashboardContextType);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] =
    useState<any[]>([]);
  const [production, setProduction] =
    useState<any[]>([]);
  const [inventory, setInventory] =
    useState<any[]>([]);
  const [expenses, setExpenses] =
    useState<any[]>([]);
  const [debtors, setDebtors] =
    useState<any[]>([]);

  async function refresh() {
    const [
      salesRes,
      productRes,
      productionRes,
      inventoryRes,
      expenseRes,
      debtorRes,
    ] = await Promise.all([
      supabase.from("sales").select("*"),
      supabase.from("products").select("*"),
      supabase
        .from("production_logs")
        .select("*"),
      supabase.from("inventory").select("*"),
      supabase.from("expenses").select("*"),
      supabase.from("debtors").select("*"),
    ]);

    setSales(salesRes.data || []);
    setProducts(productRes.data || []);
    setProduction(
      productionRes.data || []
    );
    setInventory(
      inventoryRes.data || []
    );
    setExpenses(expenseRes.data || []);
    setDebtors(debtorRes.data || []);
  }

  useEffect(() => {
    refresh();
  }, []);

  const revenue = sales.reduce(
    (sum, sale) =>
      sum +
      Number(
        sale.total_amount || 0
      ),
    0
  );

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum +
        Number(item.amount || 0),
      0
    );

  const totalDebts =
    debtors.reduce(
      (sum, item) =>
        sum +
        Number(item.balance || 0),
      0
    );

  const flourStock =
    inventory.find((item) =>
      item.material_name
        ?.toLowerCase()
        .includes("flour")
    );

  const flourBags = Number(
    flourStock?.quantity || 0
  );

  const totalProduction =
    production.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity_produced || 0
        ),
      0
    );

  const totalSales = sales.length;

  const lowStock =
    inventory.filter(
      (item) =>
        Number(item.quantity) < 10
    ).length;

  const value = useMemo(
    () => ({
      sales,
      products,
      production,
      inventory,
      expenses,
      debtors,

      revenue,
      totalExpenses,
      totalDebts,
      flourBags,
      totalProduction,
      totalSales,
      lowStock,

      refresh,
    }),
    [
      sales,
      products,
      production,
      inventory,
      expenses,
      debtors,
    ]
  );

  return (
    <DashboardContext.Provider
      value={value}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}