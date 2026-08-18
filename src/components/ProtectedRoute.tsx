"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const { data: authData } =
      await supabase.auth.getUser();

    const email =
      authData?.user?.email;

    if (!email) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("email", email);

    const role = data?.[0]?.role;

    if (!allowedRoles.includes(role)) {
      router.push("/unauthorized");
      return;
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-[#081028] flex items-center justify-center">

        {/* Background Glow */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[180px]" />

        <div className="relative flex flex-col items-center">

          {/* Logo */}

          <div className="mb-8 animate-pulse">

<Image
  src="/logo/nkiruka-logo.png"
  alt="NKIRUKA ERP"
width={140}
height={140}
  priority
/>

          </div>

          {/* Spinner */}

          <div className="relative w-24 h-24 mb-10">

            <div className="absolute inset-0 rounded-full border-[6px] border-slate-700" />

            <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-blue-500 border-r-yellow-400 animate-spin" />

          </div>

          {/* Title */}

          <h1 className="text-4xl font-black tracking-wide text-white">

            Executive Dashboard

          </h1>

          <p className="mt-3 text-lg text-slate-400 animate-pulse">

            Loading...

          </p>

          {/* Progress Bar */}

          <div className="mt-10 w-80 h-2 bg-slate-800 rounded-full overflow-hidden">

            <div className="loading-bar h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-400" />

          </div>

        </div>

        <style jsx>{`
          .loading-bar {
            animation: loading 2s ease-in-out infinite;
          }

          @keyframes loading {
            0% {
              width: 8%;
            }
            50% {
              width: 85%;
            }
            100% {
              width: 8%;
            }
          }
        `}</style>

      </div>
    );
  }

  return <>{children}</>;
}