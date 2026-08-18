"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum +
      Number(item.stock || 0) *
        Number(item.price || 0),
    0
  );

  const lowStockCount = products.filter(
    (item) =>
      Number(item.stock) <=
      Number(item.reorder_level || 20)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#08111f]">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-6 text-slate-300 text-lg">
            Loading Products...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#08111f] -m-6 p-8">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Product Management
          </h1>

          <p className="text-slate-400 mt-2 text-lg">
            Manage bakery products and live inventory.
          </p>

        </div>

        <button className="bg-yellow-500 hover:bg-yellow-400 transition px-7 py-4 rounded-2xl font-bold text-slate-900 shadow-xl">

          + Add Product

        </button>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-8">

        {/* Products */}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-7 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Total Products
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {products.length}
              </h2>

              <p className="text-green-400 mt-4 text-sm">
                Active Catalog
              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl">

              📦

            </div>

          </div>

        </div>

        {/* Stock */}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-7 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Total Stock
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {totalStock.toLocaleString()}
              </h2>

              <p className="text-green-400 mt-4 text-sm">
                Live Inventory
              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-3xl">

              📈

            </div>

          </div>

        </div>

        {/* Inventory */}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-7 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Inventory Value
              </p>

              <h2 className="text-4xl font-bold text-white mt-3">
                ₦{inventoryValue.toLocaleString()}
              </h2>

              <p className="text-purple-400 mt-4 text-sm">
                Current Value
              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-3xl">

              ₦

            </div>

          </div>

        </div>

        {/* Low Stock */}

        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-7 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Low Stock
              </p>

              <h2 className="text-5xl font-bold text-white mt-3">
                {lowStockCount}
              </h2>

              <p className="text-orange-400 mt-4 text-sm">
                Needs Attention
              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-3xl">

              ⚠️

            </div>

          </div>

        </div>

      </div>

            {/* Search Section */}

      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 mb-8">

        <div className="flex items-center gap-4">

          <div className="relative flex-1">

            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            />

          </div>

        </div>

      </div>

      {/* Product Listing */}

      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-700">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Bakery Products
            </h2>

            <p className="text-slate-400 mt-1">
              {filteredProducts.length} Products Available
            </p>

          </div>

        </div>

        <table className="w-full">

          <thead className="bg-slate-800 border-b border-slate-700">

            <tr>

              <th className="px-8 py-5 text-left text-slate-300 font-semibold">
                Product
              </th>

              <th className="px-8 py-5 text-left text-slate-300 font-semibold">
                Stock
              </th>

              <th className="px-8 py-5 text-left text-slate-300 font-semibold">
                Price
              </th>

              <th className="px-8 py-5 text-left text-slate-300 font-semibold">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-b border-slate-800 hover:bg-slate-800/70 transition duration-300"
              >
                                <td className="px-8 py-6">

                  <div className="flex items-center gap-5">

                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">

                      <img
                        src={
                          product.image_url ||
                          "https://via.placeholder.com/80"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-contain"
                      />

                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {product.name}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {product.sku || "No SKU"}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-8 py-6">

                  <span className="text-xl font-bold text-green-400">

                    {Number(product.stock).toLocaleString()}

                  </span>

                  <p className="text-xs text-slate-500 mt-1">
                    Units Available
                  </p>

                </td>

                <td className="px-8 py-6">

                  <span className="text-xl font-bold text-white">

                    ₦{Number(product.price).toLocaleString()}

                  </span>

                </td>

                <td className="px-8 py-6">

                  {Number(product.stock) === 0 ? (

                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 text-sm font-semibold">

                      <span className="w-2 h-2 rounded-full bg-red-400"></span>

                      Out of Stock

                    </span>

                  ) : Number(product.stock) <= Number(product.reorder_level || 20) ? (

                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 text-sm font-semibold">

                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>

                      Low Stock

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 text-sm font-semibold">

                      <span className="w-2 h-2 rounded-full bg-green-400"></span>

                      Available

                    </span>

                  )}

                </td>

              </tr>

            ))}

            {filteredProducts.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="py-20 text-center"
                >

                  <div className="flex flex-col items-center">

                    <div className="text-6xl mb-4">
                      📦
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      No Products Found
                    </h3>

                    <p className="text-slate-400 mt-2">
                      Try searching for another product.
                    </p>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}