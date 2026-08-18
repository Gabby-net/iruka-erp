"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Activity,
} from "lucide-react";

export default function ExecutiveHeader() {
  const today = new Date();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1F52] via-[#163E96] to-[#2563EB] p-5 text-white shadow-2xl">

      {/* Decorative Circles */}

      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10" />

      <div className="absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-center justify-between">

        <div className="flex items-center gap-6">

          <div className="h-24 w-24 rounded-3xl bg-white p-3 shadow-xl">

            <Image
              src="/images/logo.png"
              alt="IRUKA"
              width={90}
              height={90}
              className="object-contain"
            />

          </div>

          <div>

            <p className="text-blue-100 text-lg">
              Good Afternoon 👋
            </p>

            <h1 className="mt-1 text-5xl font-black tracking-tight">
              Executive Dashboard
            </h1>

            <p className="mt-3 text-blue-100 text-lg">
              NKIRUKA / IRUKA INDUSTRIES LTD
            </p>

          </div>

        </div>

        <div className="rounded-3xl bg-white/10 backdrop-blur-md p-6">

          <div className="flex items-center gap-3">

            <Activity
              size={22}
              className="text-green-400"
            />

            <span className="font-semibold">
              Business Health
            </span>

          </div>

          <h2 className="mt-3 text-3xl font-black text-green-400">
            Excellent
          </h2>

          <div className="mt-5 space-y-2 text-blue-100">

            <div className="flex items-center gap-2">

              <CalendarDays size={18} />

              {today.toLocaleDateString()}

            </div>

            <div className="flex items-center gap-2">

              <Clock3 size={18} />

              {today.toLocaleTimeString()}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}