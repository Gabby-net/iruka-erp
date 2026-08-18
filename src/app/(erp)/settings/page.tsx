"use client";

import {
  Building2,
  Users,
  Factory,
  Boxes,
  DollarSign,
  CreditCard,
  Shield,
  Bell,
  Database,
  Settings2,
  ChevronRight,
} from "lucide-react";

const settingsSections = [
  {
    title: "Company Profile",
    description: "Manage bakery name, logo, address and contact details.",
    icon: Building2,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "User & Roles",
    description: "Create users and assign permissions.",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Production",
    description: "Configure production shifts and targets.",
    icon: Factory,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Inventory",
    description: "Stock alerts and inventory preferences.",
    icon: Boxes,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Finance",
    description: "Taxes, currency and accounting settings.",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Payroll",
    description: "Salary structure and payment settings.",
    icon: CreditCard,
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "Security",
    description: "Passwords, roles and access control.",
    icon: Shield,
    color: "bg-red-100 text-red-700",
  },
  {
    title: "Notifications",
    description: "Email and system notification settings.",
    icon: Bell,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Backup & Restore",
    description: "Protect company data with scheduled backups.",
    icon: Database,
    color: "bg-indigo-100 text-indigo-700",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081028] via-[#0B1739] to-[#142850] p-8 space-y-8">

      <div className="rounded-3xl bg-gradient-to-r from-[#0B1739] via-[#142850] to-[#1E3A8A] border border-slate-700 p-8 shadow-2xl">
        <h1 className="text-5xl font-black text-white">
          System Settings
        </h1>

        <p className="text-slate-300 mt-3 text-lg">
          Configure every aspect of your Bakery ERP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {settingsSections.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="p-6">

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={28} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#071028]">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.description}
                </p>

                <button
                  className="mt-6 flex items-center gap-2 font-semibold text-[#071028] hover:text-yellow-500 transition"
                >
                  Configure
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>
          );
        })}

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex items-center gap-3 mb-5">

          <Settings2 className="text-yellow-500" size={28} />

          <h2 className="text-2xl font-bold text-[#071028]">
            Quick Preferences
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <label className="flex items-center justify-between">
            <span>Enable Email Notifications</span>
            <input type="checkbox" className="w-5 h-5" />
          </label>

          <label className="flex items-center justify-between">
            <span>Low Stock Alerts</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <span>Daily Backup</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input type="checkbox" className="w-5 h-5" />
          </label>

        </div>

      </div>

    </div>
  );
}