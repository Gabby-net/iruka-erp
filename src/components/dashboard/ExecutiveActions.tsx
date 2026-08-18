"use client";

import {
  FileText,
  FileSpreadsheet,
  FileDown,
  RefreshCw,
} from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export default function ExecutiveActions() {
  const { refresh } = useDashboard();

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="mb-8">

        <h2 className="text-3xl font-black text-slate-900">
          Executive Actions
        </h2>

        <p className="text-slate-500 mt-2">
          Reports & Business Management
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* CEO REPORT */}

        <button
          className="group rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 text-left transition hover:scale-[1.03] hover:shadow-2xl"
        >

          <FileText
            size={42}
            className="mb-6"
          />

          <h3 className="text-2xl font-black">

            Generate Report

          </h3>

          <p className="mt-3 text-blue-100">

            Generate the CEO daily business report.

          </p>

        </button>

        {/* EXCEL */}

        <button
          className="group rounded-3xl bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6 text-left transition hover:scale-[1.03] hover:shadow-2xl"
        >

          <FileSpreadsheet
            size={42}
            className="mb-6"
          />

          <h3 className="text-2xl font-black">

            Export Excel

          </h3>

          <p className="mt-3 text-green-100">

            Download all business data as Excel.

          </p>

        </button>

        {/* PDF */}

        <button
          className="group rounded-3xl bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 text-left transition hover:scale-[1.03] hover:shadow-2xl"
        >

          <FileDown
            size={42}
            className="mb-6"
          />

          <h3 className="text-2xl font-black">

            Export PDF

          </h3>

          <p className="mt-3 text-red-100">

            Download a professional PDF report.

          </p>

        </button>

        {/* REFRESH */}

        <button
          onClick={refresh}
          className="group rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 text-left transition hover:scale-[1.03] hover:shadow-2xl"
        >

          <RefreshCw
            size={42}
            className="mb-6 group-hover:rotate-180 transition duration-700"
          />

          <h3 className="text-2xl font-black">

            Refresh Data

          </h3>

          <p className="mt-3 text-orange-100">

            Reload live ERP information instantly.

          </p>

        </button>

      </div>

    </div>
  );
}