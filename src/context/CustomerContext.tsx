"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  login: (customer: Customer) => void;
  logout: () => void;
}

const CustomerContext =
  createContext<CustomerContextType | null>(null);

export function CustomerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedCustomer =
      localStorage.getItem("customer");

    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }

    setLoading(false);
  }, []);

  function login(customer: Customer) {
    localStorage.setItem(
      "customer",
      JSON.stringify(customer)
    );

    setCustomer(customer);
  }

  function logout() {
    localStorage.removeItem("customer");
    setCustomer(null);
  }

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context =
    useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomer must be used inside CustomerProvider"
    );
  }

  return context;
}