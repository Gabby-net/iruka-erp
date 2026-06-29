"use client";

import Logo from "@/components/customer-app/Logo";
import HeroBanner from "@/components/customer-app/HeroBanner";
import PrimaryButton from "@/components/customer-app/PrimaryButton";
import SecondaryButton from "@/components/customer-app/SecondaryButton";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-8 flex flex-col">

      {/* Logo */}
      <div className="mb-8">
        <Logo size={90} />
      </div>

      {/* Hero Banner */}
      <HeroBanner
        title="Fresh Bread Every Day"
        subtitle="Order your favorite bread for Pickup or Delivery."
        image="/images/bread/hero.png"
      />

      {/* Welcome Text */}
      <div className="mt-10 text-center">

        <h2 className="text-3xl font-black text-[#071028]">
          Welcome
        </h2>

        <p className="mt-3 text-gray-600">
          Fresh, Delicious, Irresistible
        </p>

      </div>

      {/* Buttons */}
      <div className="mt-auto space-y-4 pb-8">

        <PrimaryButton
          title="Login"
          href="/login"
        />

        <SecondaryButton
          title="Create Account"
          href="/register"
        />

      </div>

    </main>
  );
}