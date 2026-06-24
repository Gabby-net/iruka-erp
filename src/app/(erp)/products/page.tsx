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
<div className="flex justify-between items-center">

  <div>
    <h1 className="text-4xl font-bold text-slate-900">
      Products
    </h1>

    <p className="text-gray-500 mt-2">
      Manage all bread products and inventory
    </p>
  </div>

  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
    + Add Product
  </button>

</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
    <p className="text-sm text-gray-500">
      Total Products
    </p>

    <h2 className="text-4xl font-bold mt-2 text-slate-900">
      {products.length}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Active products in catalog
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
    <p className="text-sm text-gray-500">
      Total Stock
    </p>

    <h2 className="text-4xl font-bold mt-2 text-green-600">
      {totalStock.toLocaleString()}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Units in stock
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
    <p className="text-sm text-gray-500">
      Low Stock Items
    </p>

    <h2 className="text-4xl font-bold mt-2 text-orange-500">
      {lowStockCount}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Requires attention
    </p>
  </div>

  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
    <p className="text-sm text-gray-500">
      Inventory Value
    </p>

    <h2 className="text-3xl font-bold mt-2 text-blue-600">
      ₦{inventoryValue.toLocaleString()}
    </h2>

    <p className="text-xs text-gray-400 mt-2">
      Current stock value
    </p>
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

  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

    <table className="w-full">

      <thead className="bg-slate-50">

        <tr className="bg-gray-100">

<th className="p-4 text-left">
  Image
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
  <img
    src={
      product.image_url ||
      "https://via.placeholder.com/60"
    }
    alt={product.name}
    className="w-16 h-16 object-cover rounded-lg border"
  />
</td>


<td className="p-4">
  <div className="flex items-center gap-3">

<img
  src={product.image_url}
  alt={product.name}
  className="w-20 h-20 rounded-xl object-contain bg-white p-1 border border-gray-200"
/>

    <div>
      <p className="font-semibold">
        {product.name}
      </p>

      <p className="text-xs text-gray-500">
        {product.sku || "No SKU"}
      </p>
    </div>

  </div>
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