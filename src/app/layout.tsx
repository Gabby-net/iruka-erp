import type { Metadata } from "next";
import "./globals.css";

import { InventoryProvider } from "./context/InventoryContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "IRUKA BREAD",
  description: "Fresh Bread Ordering Platform",

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
    title: "IRUKA BREAD",
  },
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