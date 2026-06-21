"use client";
// Stock deduction deployment test

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
    const [customerName, setCustomerName] =
  useState("");

  const [amountPaid, setAmountPaid] =
  useState("");

  const [selectedSale, setSelectedSale] =
  useState<any>(null);

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

  const balance =
  totalAmount -
  Number(amountPaid || 0);

  const invoiceNumber =
  `INV-${new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "")}-${Math.floor(
      Math.random() * 1000
    )}`;

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
      customer_name:
  customerName,

  invoice_number:
  invoiceNumber,

  amount_paid:
  Number(amountPaid),

  balance:
  balance,

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

/* DEDUCT STOCK */

await supabase
  .from("products")
  .update({
    stock:
      Number(product.stock) -
      Number(quantity),
  })
  .eq(
    "id",
    product.id
  );

  setSelectedProduct("");
setQuantity("");
setCashier("");
setCustomerName("");
setAmountPaid("");

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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

<input
  type="text"
  placeholder="Customer Name"
  value={customerName}
  onChange={(e) =>
    setCustomerName(e.target.value)
  }
  className="border-2 p-4 rounded-2xl"
/>

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
            <input
  type="number"
  placeholder="Amount Paid"
  value={amountPaid}
  onChange={(e) =>
    setAmountPaid(
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
            <p className="mt-4 text-lg text-gray-600">

  Amount Paid:
  ₦
  {Number(
    amountPaid || 0
  ).toLocaleString()}

</p>

<p className="mt-2 text-xl font-bold text-red-600">

  Balance:
  ₦
  {balance.toLocaleString()}

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
  Invoice
</th>

<th className="p-4 text-left">
  Customer
</th>

                  <th className="p-4 text-left">

                    Product

                  </th>

                  <th className="p-4 text-left">

                    Quantity

                  </th>

                  <th className="p-4 text-left">
  Paid
</th>

<th className="p-4 text-left">
  Balance
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

                  <th className="p-4 text-left">
  Receipt
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
<td className="p-4">

  {sale.invoice_number}

</td>

<td className="p-4">

  {sale.customer_name}

</td>

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

                      <td className="p-4 text-blue-700">

  ₦
  {Number(
    sale.amount_paid || 0
  ).toLocaleString()}

</td>

<td className="p-4 text-red-600 font-bold">

  ₦
  {Number(
    sale.balance || 0
  ).toLocaleString()}

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

                      <td className="p-4">

  <button
    onClick={() =>
      setSelectedSale(
        sale
      )
    }
    className="bg-blue-950 text-white px-4 py-2 rounded-lg"
  >
    View Receipt
  </button>

</td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

{selectedSale && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">

      <h1 className="text-2xl font-black text-center text-blue-950">

        NKIRUKA / IRUKA INDUSTRIES LTD

      </h1>

      <div className="mt-6 space-y-3">

        <p>
          <strong>Invoice:</strong>{" "}
          {selectedSale.invoice_number}
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {selectedSale.customer_name}
        </p>

        <p>
          <strong>Product:</strong>{" "}
          {selectedSale.product_name}
        </p>

        <p>
          <strong>Quantity:</strong>{" "}
          {selectedSale.quantity}
        </p>

        <p>
          <strong>Total:</strong> ₦
          {Number(
            selectedSale.total_amount
          ).toLocaleString()}
        </p>

        <p>
          <strong>Paid:</strong> ₦
          {Number(
            selectedSale.amount_paid || 0
          ).toLocaleString()}
        </p>

        <p>
          <strong>Balance:</strong> ₦
          {Number(
            selectedSale.balance || 0
          ).toLocaleString()}
        </p>

        <p>
          <strong>Cashier:</strong>{" "}
          {selectedSale.cashier}
        </p>

      </div>

      <div className="flex gap-4 mt-8">

        <button
          onClick={() =>
            window.print()
          }
          className="bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Print Receipt
        </button>

        <button
          onClick={() =>
            setSelectedSale(null)
          }
          className="bg-gray-300 px-6 py-3 rounded-xl"
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

    </ProtectedRoute>
  );
}