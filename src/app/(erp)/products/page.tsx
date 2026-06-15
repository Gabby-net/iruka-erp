"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ProductsPage() {

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH PRODUCTS
  ========================== */

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {

    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (error) {

      console.error(error);

    } else {

      setProducts(data || []);
    }

    setLoading(false);
  }

  if (loading) {

    return (
      <div className="p-6">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-4xl font-bold">
          Inventory Products
        </h1>

        <p className="text-gray-500 mt-2">
          Live bakery inventory stock system
        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Products
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {products.length}

          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Inventory
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">

            {
              products.reduce(
                (sum, item) =>
                  sum + item.stock,
                0
              )
            }

          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Active Products
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">

            {products.length}

          </h2>

        </div>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-gray-100">

              <th className="border p-4 text-left">
                Product Name
              </th>

              <th className="border p-4 text-left">
                Current Stock
              </th>

              <th className="border p-4 text-left">
                Unit Price
              </th>

              <th className="border p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr
                key={product.id}
                className="hover:bg-gray-50"
              >

                <td className="border p-4 font-medium">

                  {product.name}

                </td>

                <td className="border p-4">

                  {product.stock}

                </td>

                <td className="border p-4">

                  ₦{product.price}

                </td>

                <td className="border p-4">

                  <span
                    className={
                      product.stock <= 20

                        ? "text-red-600 font-bold"

                        : "text-green-600 font-bold"
                    }
                  >

                    {product.stock <= 20
                      ? "Low Stock"
                      : "In Stock"}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}