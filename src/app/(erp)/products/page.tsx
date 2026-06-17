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
product.name
?.toLowerCase()
.includes(search.toLowerCase())
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
return ( <div className="p-6">
Loading products... </div>
);
}

return ( <div className="space-y-8">

```
  <div>
    <h1 className="text-4xl font-bold text-slate-900">
      Products Management
    </h1>

    <p className="text-gray-500 mt-2">
      Bakery products and stock overview
    </p>
  </div>

  <div className="grid md:grid-cols-4 gap-6">

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
        Total Stock
      </p>

      <h2 className="text-3xl font-bold text-green-600 mt-2">
        {totalStock}
      </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500">
        Low Stock
      </p>

      <h2 className="text-3xl font-bold text-red-600 mt-2">
        {lowStockCount}
      </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-gray-500">
        Inventory Value
      </p>

      <h2 className="text-3xl font-bold text-blue-600 mt-2">
        ₦{inventoryValue.toLocaleString()}
      </h2>
    </div>

  </div>

  <div className="bg-white rounded-2xl shadow p-4">

    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="w-full border rounded-xl px-4 py-3"
    />

  </div>

  <div className="bg-white rounded-2xl shadow overflow-hidden">

    <table className="w-full">

      <thead>

        <tr className="bg-gray-100">

          <th className="p-4 text-left">
            SKU
          </th>

          <th className="p-4 text-left">
            Product
          </th>

          <th className="p-4 text-left">
            Stock
          </th>

          <th className="p-4 text-left">
            Price
          </th>

          <th className="p-4 text-left">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {filteredProducts.map(
          (product) => (

            <tr
              key={product.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4">
                {product.sku || "-"}
              </td>

              <td className="p-4 font-semibold">
                {product.name}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                ₦{product.price}
              </td>

              <td className="p-4">

                <span
                  className={
                    Number(product.stock) <=
                    Number(
                      product.reorder_level ||
                        20
                    )
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-bold"
                  }
                >
                  {Number(product.stock) <=
                  Number(
                    product.reorder_level ||
                      20
                  )
                    ? "Low Stock"
                    : "In Stock"}
                </span>

              </td>

            </tr>
          )
        )}

      </tbody>

    </table>

  </div>

</div>
);
}