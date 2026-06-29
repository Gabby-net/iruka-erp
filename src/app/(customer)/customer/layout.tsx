import { ReactNode } from "react";
import CustomerProtectedRoute from "@/components/customer-app/CustomerProtectedRoute";

export default function CustomerPagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CustomerProtectedRoute>
      {children}
    </CustomerProtectedRoute>
  );
}