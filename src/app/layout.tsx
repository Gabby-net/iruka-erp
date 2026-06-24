import {
  InventoryProvider
} from "./context/InventoryContext";

import "./globals.css";

import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "NKIRUKA / IRUKA INDUSTRIES LTD ERP",
  description:
    "Bakery Production Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <InventoryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}