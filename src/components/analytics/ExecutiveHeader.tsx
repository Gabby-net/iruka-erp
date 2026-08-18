"use client";

import {
  CalendarDays,
  Download,
  RefreshCw,
  TrendingUp,
  User,
  ShieldCheck,
  Clock3,
} from "lucide-react";

interface ExecutiveHeaderProps {
  period: "today" | "week" | "month" | "year";
  setPeriod: (period: "today" | "week" | "month" | "year") => void;
  onRefresh?: () => void;
}

export default function ExecutiveHeader({
  period,
  setPeriod,
  onRefresh,
}: ExecutiveHeaderProps) {

  const now = new Date();

  const currentDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mb-8">

      {/* ===========================
          TOP HEADER
      =========================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        <div className="flex items-center gap-5">

          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-700 shadow-xl flex items-center justify-center">

            <TrendingUp className="w-8 h-8 text-black" />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-white tracking-tight">

              Analytics Dashboard

            </h1>

            <p className="text-slate-400 mt-1">

              Executive Business Intelligence • NKIRUKA INDUSTRIES LTD

            </p>

          </div>

        </div>

        <div className="flex flex-wrap items-center gap-4">

          {/* Admin Card */}

          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 shadow-lg">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">

                <User className="text-black" size={22} />

              </div>

              <div>

                <h3 className="text-white font-semibold">

                  Administrator

                </h3>

                <div className="flex items-center gap-2 text-green-400 text-sm mt-1">

                  <ShieldCheck size={14} />

                  Online

                </div>

              </div>

            </div>

          </div>

          {/* Date Card */}

          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 shadow-lg">

            <div className="flex items-center gap-2 text-amber-400">

              <CalendarDays size={18} />

              <span className="text-white text-sm font-semibold">

                {currentDate}

              </span>

            </div>

            <div className="flex items-center gap-2 mt-2 text-slate-300">

              <Clock3 size={15} />

              <span>{currentTime}</span>

            </div>

          </div>

          {/* Refresh */}

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-300"
          >

            <RefreshCw size={18} />

            Refresh

          </button>

          {/* Export */}

          <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-semibold shadow-lg transition-all duration-300"
          >

            <Download size={18} />

            Export Report

          </button>

        </div>

      </div>

      {/* ===========================
          FILTER BAR
      =========================== */}

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-3">

            <CalendarDays className="text-amber-400" />

            <span className="text-slate-300 font-semibold">

              Report Period

            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "year", label: "This Year" },
            ].map((item) => (

              <button
                key={item.value}
                onClick={() =>
                  setPeriod(
                    item.value as
                      | "today"
                      | "week"
                      | "month"
                      | "year"
                  )
                }
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  period === item.value
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >

                {item.label}

              </button>

            ))}

          </div>

        </div>

      </div>
            {/* ===========================
          EXECUTIVE BANNER
      =========================== */}

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-2xl">

        <div className="relative p-8">

          {/* Decorative Background */}

          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            {/* Left Side */}

            <div className="max-w-3xl">

              <span className="inline-flex items-center rounded-full bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm font-semibold text-amber-400">

                Executive Intelligence Center

              </span>

              <h2 className="mt-5 text-4xl font-bold text-white leading-tight">

                Monitor Every Department From One Premium Dashboard

              </h2>

              <p className="mt-5 text-slate-400 leading-8 text-lg">

                Track revenue, expenses, profitability, customer activity,
                production efficiency, inventory health, sales performance,
                operational trends and strategic business insights in real
                time across the entire organization.

              </p>

            </div>

            {/* Right Side */}

            <div className="grid grid-cols-2 gap-4 min-w-[340px]">

              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">

                <p className="text-sm text-slate-300">

                  System Status

                </p>

                <h3 className="mt-3 text-2xl font-bold text-green-400">

                  ● Online

                </h3>

              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">

                <p className="text-sm text-slate-300">

                  Dashboard

                </p>

                <h3 className="mt-3 text-2xl font-bold text-blue-400">

                  Live Data

                </h3>

              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">

                <p className="text-sm text-slate-300">

                  ERP Version

                </p>

                <h3 className="mt-3 text-2xl font-bold text-purple-400">

                  Version 1.0

                </h3>

              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">

                <p className="text-sm text-slate-300">

                  Report Period

                </p>

                <h3 className="mt-3 text-2xl font-bold text-amber-400 capitalize">

                  {period}

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}