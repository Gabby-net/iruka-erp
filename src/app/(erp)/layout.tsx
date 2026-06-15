"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#071028]">

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          <Menu size={28} />
        </button>

        <h1 className="ml-4 font-black text-yellow-500">
          IRUKA ERP
        </h1>

      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="w-full lg:ml-[280px] p-4 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>

    </div>
  );
}