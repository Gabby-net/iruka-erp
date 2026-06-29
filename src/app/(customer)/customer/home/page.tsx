"use client";

import { useMemo, useState } from "react";

import useProducts from "@/hooks/useProducts";

import HomeHeader from "@/components/customer-app/home/HomeHeader";
import SearchBar from "@/components/customer-app/home/SearchBar";
import CategoryTabs from "@/components/customer-app/home/CategoryTabs";
import FeaturedBanner from "@/components/customer-app/home/FeaturedBanner";
import ProductGrid from "@/components/customer-app/home/ProductGrid";
import BottomNavigation from "@/components/customer-app/home/BottomNavigation";
import SectionTitle from "@/components/customer-app/home/SectionTitle";

export default function CustomerHomePage() {
  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <main className="min-h-screen bg-[#F5F7FA] pb-40">

      <HomeHeader />

      <div className="max-w-7xl mx-auto px-5">

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <CategoryTabs
          selected={category}
          onSelect={setCategory}
        />

        <FeaturedBanner />

        <SectionTitle title="Fresh Bread Today" />

        {loading ? (

          <div className="text-center py-20">
            Loading Products...
          </div>

        ) : (

          <ProductGrid
            products={filteredProducts}
          />

        )}

      </div>

      <BottomNavigation />

    </main>
  );
}