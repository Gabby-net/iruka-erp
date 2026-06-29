"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/customer-app/Logo";
import LoadingDots from "@/components/customer-app/LoadingDots";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/customer/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center px-6">

      <Logo size={140} />

      <div className="mt-12">
        <LoadingDots />
      </div>

    </main>
  );
}