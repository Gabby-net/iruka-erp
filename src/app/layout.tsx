import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import { InventoryProvider } from "./context/InventoryContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "IRUKA ERP",
  description:
    "IRUKA ERP - Enterprise Resource Planning System for IRUKA Industries Ltd.",

  manifest: "/manifest",

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IRUKA ERP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#081028]">
        <InventoryProvider>
          <AuthProvider>
            {children}

            <Toaster
              position="top-right"
              richColors
              expand
              closeButton
              duration={3500}
              theme="dark"
              toastOptions={{
                style: {
                  background: "#0B1739",
                  color: "#FFFFFF",
                  border: "1px solid #1E3A8A",
                  borderRadius: "18px",
                  padding: "16px",
                  boxShadow: "0 20px 60px rgba(0,0,0,.45)",
                },
              }}
            />
          </AuthProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}