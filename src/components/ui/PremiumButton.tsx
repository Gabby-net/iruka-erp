"use client";

import { Loader2 } from "lucide-react";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function PremiumButton({
  children,
  onClick,
  loading = false,
  loadingText = "Loading...",
  className = "",
  type = "button",
}: PremiumButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        rounded-2xl
        bg-gradient-to-r
        from-blue-700
        to-indigo-900
        text-white
        font-bold
        px-8
        py-4
        shadow-xl
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
        disabled:opacity-70
        flex
        items-center
        justify-center
        gap-3
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}