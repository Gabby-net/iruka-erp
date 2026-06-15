import {
  InventoryProvider
} from "./context/InventoryContext";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

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