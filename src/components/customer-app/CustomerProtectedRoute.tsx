"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";

export default function CustomerProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { customer, loading } = useCustomer();

  // Allow public auth pages
  const isAuthPage =
    pathname.startsWith("/customer/auth");

  useEffect(() => {
    if (!loading && !customer && !isAuthPage) {
      router.replace("/customer/auth/login");
    }
  }, [
    customer,
    loading,
    router,
    isAuthPage,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Allow login/register pages without authentication
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Hide protected pages until redirect happens
  if (!customer) {
    return null;
  }

  return <>{children}</>;
}