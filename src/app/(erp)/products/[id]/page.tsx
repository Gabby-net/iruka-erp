"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowLeft,
  Package,
  Tag,
  Boxes,
  AlertTriangle,
  Calendar,
  DollarSign,
  RefreshCw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function ProductDetailsPage() {
const params = useParams();
const router = useRouter();
const searchParams = useSearchParams();

const productId = params.id as string;

const from = searchParams.get("from");

const backRoute =
  from === "dashboard"
    ? "/dashboard"
    : "/products";

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    fetchProduct();

    const channel = supabase
      .channel(`product-details-${productId}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
          filter: `id=eq.${productId}`,
        },
        () => {
          fetchProduct();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Product Details Error:", error);
      setProduct(null);
    } else {
      setProduct(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08111f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-6 text-slate-300 text-lg">
            Loading Product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#08111f] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-5">
            📦
          </div>

          <h1 className="text-3xl font-bold text-white">
            Product Not Found
          </h1>

          <p className="text-slate-400 mt-3">
            This product could not be found.
          </p>

          <button
            onClick={() => {
  const from = searchParams.get("from");

  if (from === "products") {
    router.push("/products");
  } else {
    router.push("/dashboard");
  }
}}
            className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stock = Number(product.stock || 0);

  const reorderLevel = Number(
    product.reorder_level || 20
  );

  const price = Number(
    product.price || 0
  );

  const inventoryValue = stock * price;

  const isOutOfStock = stock === 0;

  const isLowStock =
    stock > 0 && stock <= reorderLevel;

  const status = isOutOfStock
    ? "Out of Stock"
    : isLowStock
    ? "Low Stock"
    : "Available";

  const statusColor = isOutOfStock
    ? "red"
    : isLowStock
    ? "yellow"
    : "green";

  return (
    <div className="min-h-screen bg-[#08111f] -m-6 p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.push(backRoute)}
            className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="text-slate-500 text-sm">
              Product Management
            </p>

            <h1 className="text-4xl font-black text-white">
              {product.name}
            </h1>
          </div>

        </div>

        <button
          onClick={fetchProduct}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-5 py-3 rounded-xl transition"
        >
          <RefreshCw size={18} />

          Refresh
        </button>

      </div>

      {/* =====================================================
          MAIN PRODUCT CARD
      ===================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* PRODUCT IMAGE */}

        <div className="xl:col-span-1">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">

            <div className="h-[400px] bg-slate-800 flex items-center justify-center">

              <img
                src={
                  product.image_url ||
                  "/placeholder.png"
                }
                alt={product.name}
                className="max-h-[340px] max-w-[85%] object-contain"
              />

            </div>

            <div className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400 text-sm">
                    Product ID
                  </p>

                  <p className="text-white font-semibold mt-1 break-all">
                    {product.id}
                  </p>

                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    statusColor === "red"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : statusColor === "yellow"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {status}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div className="xl:col-span-2">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRICE */}

            <div className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-700/50 rounded-3xl p-7 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-green-300">
                    Selling Price
                  </p>

                  <h2 className="text-4xl font-black text-white mt-3">
                    ₦{price.toLocaleString()}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign
                    className="text-green-400"
                    size={30}
                  />
                </div>

              </div>

            </div>

            {/* STOCK */}

            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-700/50 rounded-3xl p-7 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-blue-300">
                    Current Stock
                  </p>

                  <h2 className="text-4xl font-black text-white mt-3">
                    {stock.toLocaleString()}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Units Available
                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Boxes
                    className="text-blue-400"
                    size={30}
                  />
                </div>

              </div>

            </div>

            {/* INVENTORY VALUE */}

            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-700/50 rounded-3xl p-7 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-purple-300">
                    Inventory Value
                  </p>

                  <h2 className="text-4xl font-black text-white mt-3">
                    ₦{inventoryValue.toLocaleString()}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Stock × Selling Price
                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Package
                    className="text-purple-400"
                    size={30}
                  />
                </div>

              </div>

            </div>

            {/* REORDER LEVEL */}

            <div className="bg-gradient-to-br from-orange-900/40 to-slate-900 border border-orange-700/50 rounded-3xl p-7 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-orange-300">
                    Reorder Level
                  </p>

                  <h2 className="text-4xl font-black text-white mt-3">
                    {reorderLevel.toLocaleString()}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Minimum Stock Level
                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle
                    className="text-orange-400"
                    size={30}
                  />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="mt-6 bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">

            <div className="flex items-center gap-3 mb-7">

              <Tag
                className="text-yellow-400"
                size={25}
              />

              <h2 className="text-2xl font-bold text-white">
                Product Information
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">

              <div>
                <p className="text-slate-500 text-sm">
                  Product Name
                </p>

                <p className="text-white text-lg font-semibold mt-1">
                  {product.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  SKU
                </p>

                <p className="text-white text-lg font-semibold mt-1">
                  {product.sku || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Product ID
                </p>

                <p className="text-white text-lg font-semibold mt-1 break-all">
                  {product.id || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Status
                </p>

                <p className="text-white text-lg font-semibold mt-1">
                  {status}
                </p>
              </div>

              {product.description && (
                <div className="md:col-span-2">

                  <p className="text-slate-500 text-sm">
                    Description
                  </p>

                  <p className="text-slate-200 mt-2 leading-7">
                    {product.description}
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              DATES
          ================================================= */}

          <div className="mt-6 bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">

            <div className="flex items-center gap-3 mb-7">

              <Calendar
                className="text-blue-400"
                size={25}
              />

              <h2 className="text-2xl font-bold text-white">
                Record Information
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <p className="text-slate-500 text-sm">
                  Created
                </p>

                <p className="text-white mt-2">
                  {product.created_at
                    ? new Date(
                        product.created_at
                      ).toLocaleString("en-GB")
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-sm">
                  Last Updated
                </p>

                <p className="text-white mt-2">
                  {product.updated_at
                    ? new Date(
                        product.updated_at
                      ).toLocaleString("en-GB")
                    : "N/A"}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          LIVE STATUS
      ===================================================== */}

      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 flex items-center gap-3">

        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

        <p className="text-slate-300">
          Live product information
        </p>

        <span className="text-slate-500">
          •
        </span>

        <p className="text-slate-500 text-sm">
          Updates automatically when this product changes.
        </p>

      </div>

    </div>
  );
}