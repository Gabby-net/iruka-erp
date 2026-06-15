"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function OrdersPage() {

  const router = useRouter();

  const [products, setProducts] =
    useState<any[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [payment, setPayment] =
    useState("");

  const [orderItems, setOrderItems] =
    useState([
      {
        product: "",
        quantity: "",
      },
    ]);

  useEffect(() => {

    fetchProducts();

  }, []);

  async function fetchProducts() {

    const { data } = await supabase

      .from("products")

      .select("*");

    setProducts(data || []);
  }

  function addOrderRow() {

    setOrderItems([
      ...orderItems,

      {
        product: "",
        quantity: "",
      },
    ]);
  }

  function updateItem(
  index: number,
  field: "product" | "quantity",
  value: string
) {

  const updated =
    [...orderItems];

  updated[index][field] =
    value;

  setOrderItems(updated);
}

  function removeItem(
    index: number
  ) {

    const updated =
      [...orderItems];

    updated.splice(index, 1);

    setOrderItems(updated);
  }

  function getProductPrice(
    productName: string
  ) {

    const product =
      products.find(
        (p) =>
          p.name ===
          productName
      );

    return product
      ? Number(product.price)
      : 0;
  }

  function calculateTotal() {

    return orderItems.reduce(
      (total, item) => {

        const price =
          getProductPrice(
            item.product
          );

        return (
          total +
          price *
            Number(
              item.quantity || 0
            )
        );
      },

      0
    );
  }

  async function saveOrder() {

    if (!customerName) {

      alert(
        "Enter customer name"
      );

      return;
    }

    const totalAmount =
      calculateTotal();

    if (totalAmount <= 0) {

      alert(
        "Invalid order"
      );

      return;
    }

    /* =========================
       CHECK STOCK
    ========================== */

    for (const item of orderItems) {

      const product =
        products.find(
          (p) =>
            p.name ===
            item.product
        );

      if (!product) {

        alert(
          `${item.product} not found`
        );

        return;
      }

      if (
        Number(product.stock) <
        Number(item.quantity)
      ) {

        alert(
          `${item.product} stock is low`
        );

        return;
      }
    }

    /* =========================
       SAVE ORDER
    ========================== */

    for (const item of orderItems) {

      const product =
        products.find(
          (p) =>
            p.name ===
            item.product
        );

      await supabase

        .from("orders")

        .insert([
          {
            customer_name:
              customerName,

            product_name:
              item.product,

            quantity:
              Number(
                item.quantity
              ),

            total_amount:
              getProductPrice(
                item.product
              ) *
              Number(
                item.quantity
              ),
          },
        ]);

      /* =========================
         DEDUCT PRODUCT STOCK
      ========================== */

      const newStock =
        Number(
          product.stock
        ) -
        Number(
          item.quantity
        );

      await supabase

        .from("products")

        .update({
          stock: newStock,
        })

        .eq(
          "id",
          product.id
        );
    }

    /* =========================
       SAVE SALES RECORD
    ========================== */

    const balance =
      totalAmount -
      Number(payment);

    await supabase

      .from("sales")

      .insert([
        {
          customer_name:
            customerName,

          total_amount:
            totalAmount,

          payment:
            Number(payment),

          balance:
            balance,
        },
      ]);

    /* =========================
       OPEN RECEIPT PAGE
    ========================== */

    router.push(

      `/receipt?customer=${customerName}

      &product=${orderItems[0].product}

      &quantity=${orderItems[0].quantity}

      &total=${totalAmount}

      &payment=${payment}

      &balance=${balance}`

    );
  }

  const totalAmount =
    calculateTotal();

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

            Orders Management

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Enterprise bakery sales system

          </p>

        </div>

        {/* ORDER FORM */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Create Customer Order

          </h2>

          {/* CUSTOMER */}

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="w-full border-2 p-4 rounded-2xl mb-6"
          />

          {/* ORDER ITEMS */}

          <div className="flex flex-col gap-4">

            {orderItems.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
                >

                  {/* PRODUCT */}

                  <select
                    value={
                      item.product
                    }

                    onChange={(e) =>
                      updateItem(
                        index,
                        "product",
                        e.target
                          .value
                      )
                    }

                    className="border-2 p-4 rounded-2xl"
                  >

                    <option value="">
                      Select Bread
                    </option>

                    {products.map(
                      (
                        product
                      ) => (

                        <option
                          key={
                            product.id
                          }

                          value={
                            product.name
                          }
                        >

                          {
                            product.name
                          }

                        </option>
                      )
                    )}

                  </select>

                  {/* QUANTITY */}

                  <input
                    type="number"
                    placeholder="Quantity"

                    value={
                      item.quantity
                    }

                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target
                          .value
                      )
                    }

                    className="border-2 p-4 rounded-2xl"
                  />

                  {/* PRICE */}

                  <div className="font-bold text-2xl text-green-700">

                    ₦
                    {(
                      getProductPrice(
                        item.product
                      ) *
                      Number(
                        item.quantity ||
                          0
                      )
                    ).toLocaleString()}

                  </div>

                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }

                    className="bg-red-700 hover:bg-red-600 text-white p-4 rounded-2xl"
                  >

                    Remove

                  </button>

                </div>
              )
            )}

          </div>

          {/* ADD ROW */}

          <button
            onClick={
              addOrderRow
            }

            className="mt-6 bg-blue-700 hover:bg-blue-600 text-white p-4 rounded-2xl font-bold"
          >

            Add Another Bread

          </button>

          {/* PAYMENT */}

          <div className="mt-10">

            <h3 className="text-2xl font-bold mb-4">

              Payment

            </h3>

            <input
              type="number"
              placeholder="Amount Paid"

              value={payment}

              onChange={(e) =>
                setPayment(
                  e.target.value
                )
              }

              className="w-full border-2 p-4 rounded-2xl"
            />

          </div>

          {/* TOTAL */}

          <div className="mt-10">

            <h2 className="text-3xl font-black">

              Total Amount

            </h2>

            <p className="text-5xl font-black text-green-700 mt-2">

              ₦
              {totalAmount.toLocaleString()}

            </p>

          </div>

          {/* SAVE */}

          <button
            onClick={saveOrder}

            className="mt-10 w-full bg-black hover:bg-gray-800 text-white p-5 rounded-2xl font-bold text-xl"
          >

            Save Order

          </button>

        </div>

      </div>

    </ProtectedRoute>
  );
}