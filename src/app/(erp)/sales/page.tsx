"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function SalesPage() {

  /* =========================
     STATES
  ========================== */

  const [products, setProducts] =
    useState<any[]>([]);

  const [sales, setSales] =
    useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] =
    useState("");



  const [cashier, setCashier] =
    useState("");

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {

    fetchData();

  }, []);

  async function fetchData() {

    /* PRODUCTS */

    const {
      data: productsData,
    } = await supabase

      .from("products")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    /* SALES */

    const {
      data: salesData,
    } = await supabase

      .from("sales")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    setProducts(productsData || []);

    setSales(salesData || []);
  }

  /* =========================
     TOTAL
  ========================== */

  const selectedProductData =
  products.find(
    (product) =>
      product.name === selectedProduct
  );

const unitPrice =
  Number(
    selectedProductData?.price || 0
  );

const totalAmount =
  Number(quantity || 0) *
  unitPrice;

  /* =========================
     SAVE SALE
  ========================== */

async function saveSale() {

  if (
    !selectedProduct ||
    !quantity ||
    !cashier
  ) {
    alert("Fill all fields");
    return;
  }

  const product = products.find(
    (p) =>
      p.name === selectedProduct
  );

  if (!product) {
    alert("Product not found");
    return;
  }

  if (
    Number(quantity) >
    Number(product.stock)
  ) {
    alert(
      `Only ${product.stock} units available`
    );
    return;
  }

  await supabase
    .from("sales")
    .insert([
      {
        product_name:
          selectedProduct,

        quantity:
          Number(quantity),

        unit_price:
          Number(unitPrice),

        total_amount:
          totalAmount,

        cashier,
      },
    ]);

  setSelectedProduct("");
  setQuantity("");
  setCashier("");

  fetchData();

  alert(
    "Sale recorded successfully"
  );
}

  /* =========================
     SUMMARY
  ========================== */

  const totalSales =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total_amount || 0
        ),
      0
    );

  const totalProductsSold =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.quantity || 0
        ),
      0
    );

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "cashier",
      ]}
    >

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            Bakery POS System

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Daily sales & cashier management

          </p>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* TOTAL REVENUE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Total Revenue

            </h2>

            <p className="text-5xl font-black text-green-700 mt-4">

              ₦
              {totalSales.toLocaleString()}

            </p>

          </div>

          {/* PRODUCTS SOLD */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Products Sold

            </h2>

            <p className="text-5xl font-black text-blue-950 mt-4">

              {totalProductsSold}

            </p>

          </div>

          {/* TOTAL TRANSACTIONS */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Transactions

            </h2>

            <p className="text-5xl font-black text-orange-600 mt-4">

              {sales.length}

            </p>

          </div>

        </div>

        {/* POS FORM */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Record Sale

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* PRODUCT */}

            <select
              value={selectedProduct}

              onChange={(e) =>
                setSelectedProduct(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            >

              <option value="">

                Select Product

              </option>

              {products.map(
                (product) => (

                  <option
                    key={product.id}
                    value={
                      product.name
                    }
                  >

                    {product.name}

                  </option>
                )
              )}

            </select>

            {/* QUANTITY */}

            <input
              type="number"

              placeholder="Quantity"

              value={quantity}

              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            {/* UNIT PRICE */}

<div className="border-2 p-4 rounded-2xl bg-gray-50">

  <p className="text-sm text-gray-500">
    Unit Price
  </p>

  <p className="text-2xl font-bold text-green-700">
    ₦{unitPrice.toLocaleString()}
  </p>

  <div className="mt-3 border-t pt-3">

    <p className="text-sm text-gray-500">
      Available Stock
    </p>

    <p className="text-xl font-bold text-blue-900">
      {selectedProductData?.stock || 0}
    </p>

  </div>

</div>

            {/* CASHIER */}

            <input
              type="text"

              placeholder="Cashier Name"

              value={cashier}

              onChange={(e) =>
                setCashier(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

          </div>

          {/* TOTAL */}

          <div className="mt-8 bg-gray-100 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold text-gray-700">

              Total Amount

            </h2>

            <p className="text-5xl font-black text-green-700 mt-3">

              ₦
              {totalAmount.toLocaleString()}

            </p>

          </div>

          {/* BUTTON */}

          <button
            onClick={saveSale}

            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold"
          >

            Complete Sale

          </button>

        </div>

        {/* SALES HISTORY */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Sales History

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Product

                  </th>

                  <th className="p-4 text-left">

                    Quantity

                  </th>

                  <th className="p-4 text-left">

                    Unit Price

                  </th>

                  <th className="p-4 text-left">

                    Total

                  </th>

                  <th className="p-4 text-left">

                    Cashier

                  </th>

                  <th className="p-4 text-left">

                    Date

                  </th>

                </tr>

              </thead>

              <tbody>

                {sales.map(
                  (sale) => (

                    <tr
                      key={sale.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-semibold">

                        {
                          sale.product_name
                        }

                      </td>

                      <td className="p-4">

                        {
                          sale.quantity
                        }

                      </td>

                      <td className="p-4">

                        ₦
                        {Number(
                          sale.unit_price
                        ).toLocaleString()}

                      </td>

                      <td className="p-4 text-green-700 font-black">

                        ₦
                        {Number(
                          sale.total_amount
                        ).toLocaleString()}

                      </td>

                      <td className="p-4">

                        {
                          sale.cashier
                        }

                      </td>

                      <td className="p-4">

                        {new Date(
                          sale.created_at
                        ).toLocaleString()}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </ProtectedRoute>
  );
}