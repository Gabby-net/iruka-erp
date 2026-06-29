"use client";

import {
  House,
  ShoppingBasket,
  ShoppingCart,
  Package,
  User,
} from "lucide-react";

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl px-8 py-4 flex gap-8 z-50">

      <House className="text-[#071028]" />

      <ShoppingBasket className="text-gray-400" />

      <ShoppingCart className="text-gray-400" />

      <Package className="text-gray-400" />

      <User className="text-gray-400" />

    </div>
  );
}