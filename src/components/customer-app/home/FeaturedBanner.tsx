"use client";

export default function FeaturedBanner() {
  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-r from-[#071028] to-[#B45309] p-8 text-white shadow-xl">

      <p className="text-sm uppercase tracking-widest text-orange-200">
        Fresh Today
      </p>

      <h2 className="text-3xl font-black mt-2">
        Oven Fresh Bread
      </h2>

      <p className="mt-3 text-orange-100 max-w-lg">
        Order your favourite IRUKA Bread from anywhere and enjoy
        fresh delivery or convenient pickup.
      </p>

    </div>
  );
}