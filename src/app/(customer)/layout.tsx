import { ReactNode } from "react";

import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CustomerProvider>
      <CartProvider>
        <main className="min-h-screen bg-[#FFFDF8] text-gray-900">
          {children}
        </main>
      </CartProvider>
    </CustomerProvider>
  );
}