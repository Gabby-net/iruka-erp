
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
  setPeriod: (
    period: "today" | "week" | "month" | "year"
  ) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function ExecutiveHeader({
  period,
  setPeriod,
  onRefresh,
  onExport,
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

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* LEFT */}

        <div className="flex items-center gap-5">

          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-700 shadow-xl flex items-center justify-center">

            <TrendingUp
              className="w-8 h-8 text-black"
            />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-white tracking-tight">
              Analytics Dashboard
            </h1>

            <p className="text-slate-400 mt-1">
              Business performance, sales, production and inventory analytics
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-4">

          {/* =================================================
              ADMIN CARD
          ================================================= */}

          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 shadow-lg">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">

                <User
                  className="text-black"
                  size={22}
                />

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

          {/* =================================================
              DATE / TIME
          ================================================= */}

          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 shadow-lg">

            <div className="flex items-center gap-2 text-amber-400">

              <CalendarDays size={18} />

              <span className="text-white text-sm font-semibold">
                {currentDate}
              </span>

            </div>

            <div className="flex items-center gap-2 mt-2 text-slate-300">

              <Clock3 size={15} />

              <span>
                {currentTime}
              </span>

            </div>

          </div>

          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all duration-300"
          >

            <RefreshCw size={18} />

            Refresh

          </button>

          {/* =================================================
              EXPORT REPORT
          ================================================= */}

          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-semibold shadow-lg transition-all duration-300"
          >

            <Download size={18} />

            Export Report

          </button>

        </div>

      </div>

      {/* =====================================================
          REPORT PERIOD
      ===================================================== */}

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-3">

            <CalendarDays
              className="text-amber-400"
            />

            <span className="text-slate-300 font-semibold">
              Report Period
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {[
              {
                value: "today",
                label: "Today",
              },
              {
                value: "week",
                label: "This Week",
              },
              {
                value: "month",
                label: "This Month",
              },
              {
                value: "year",
                label: "This Year",
              },
            ].map((item) => (

              <button
                key={item.value}
                type="button"
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

    </div>
  );
}