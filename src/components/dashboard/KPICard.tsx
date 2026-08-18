"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  subtitle?: string;
};

export default function KPICard({
  title,
  value,
  icon,
  color,
  change,
  subtitle,
}: KPICardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Background Glow */}

      <div
        className={`absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-10 transition-all duration-300 group-hover:scale-150 ${color}`}
      />

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {change !== undefined && (
            <div
              className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}

              {positive ? "+" : ""}
              {change}%
            </div>
          )}
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ${color}`}
        >
          {icon}
        </div>

      </div>

      {/* Bottom Accent */}

      <div
        className={`absolute bottom-0 left-0 h-1 w-full ${color}`}
      />

    </div>
  );
}