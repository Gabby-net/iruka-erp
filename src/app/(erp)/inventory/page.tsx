"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function InventoryPage() {

  /* =========================
     STATES
  ========================== */

  const [inventory, setInventory] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [unit, setUnit] =
    useState("");
  const [supplier, setSupplier] =
  useState("");

const [invoiceNumber, setInvoiceNumber] =
  useState("");  

  useEffect(() => {

    fetchInventory();

  }, []);

  /* =========================
     FETCH INVENTORY
  ========================== */

  async function fetchInventory() {

    const { data } =
      await supabase

        .from("inventory")

        .select("*")

        .order("created_at", {
          ascending: false,
        });

    setInventory(data || []);
  }

  /* =========================
     ADD INVENTORY
  ========================== */

async function addInventory() {

  if (
    !name ||
    !quantity
  ) {

    alert(
      "Fill all fields"
    );

    return;
  }

  const existingMaterial =
    inventory.find(
      (item) =>
        item.name
          .toLowerCase()
          .trim() ===
        name
          .toLowerCase()
          .trim()
    );

  if (
    existingMaterial
  ) {

    const newQuantity =
      Number(
        existingMaterial.quantity
      ) +
      Number(quantity);

    await supabase

      .from("inventory")

      .update({
        quantity:
          newQuantity,
      })

      .eq(
        "id",
        existingMaterial.id
      );

  } else {

    await supabase

      .from("inventory")

      .insert([
        {
          name,
          quantity:
            Number(quantity),
          unit,
        },
      ]);
  }

const { data, error } =
  await supabase

    .from("inventory_transactions")

    .insert([
      {
        material_name: name,

        quantity_used: Number(quantity),

        transaction_type: "RECEIVED",

        reference:
          invoiceNumber || "Stock Receipt",
      },
    ])

    .select();

console.log("DATA:", data);
console.log("ERROR:", error);

  setName("");

  setQuantity("");

  setUnit("");

  setSupplier("");

  setInvoiceNumber("");

  fetchInventory();

  alert(
    "Inventory received successfully"
  );
}

  /* =========================
     LOW STOCK CHECKER
  ========================== */

  function isLowStock(
    item: any
  ) {

    if (
      item.name === "Flour" &&
      Number(item.quantity) < 400
    ) {

      return true;
    }

    if (
      item.name === "Sugar" &&
      Number(item.quantity) < 50
    ) {

      return true;
    }

    if (
      item.name === "Yeast" &&
      Number(item.quantity) < 10
    ) {

      return true;
    }

    if (
      item.name === "Butter" &&
      Number(item.quantity) < 10
    ) {

      return true;
    }

    return false;
  }

  /* =========================
     TOTAL MATERIALS
  ========================== */

  const totalMaterials =
    inventory.length;

  const lowStockCount =
    inventory.filter(
      (item) =>
        isLowStock(item)
    ).length;

  return (

    <ProtectedRoute
  allowedRoles={[
    "admin",
    "inventory",
  ]}
>

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            Smart Inventory Control

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Bakery raw material monitoring system

          </p>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* TOTAL MATERIALS */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Total Materials

            </h2>

            <p className="text-5xl font-black text-blue-950 mt-4">

              {totalMaterials}

            </p>

          </div>

          {/* LOW STOCK */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Low Stock Alerts

            </h2>

            <p className="text-5xl font-black text-red-600 mt-4">

              {lowStockCount}

            </p>

          </div>

          {/* HEALTH STATUS */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Inventory Health

            </h2>

            <p className="text-3xl font-black text-green-700 mt-6">

              {lowStockCount > 0
                ? "Attention Needed"
                : "Healthy"}

            </p>

          </div>

        </div>

        {/* LOW STOCK ALERTS */}

        {lowStockCount > 0 && (

          <div className="bg-red-100 border-2 border-red-500 rounded-3xl p-6 mb-10">

            <h2 className="text-3xl font-black text-red-700 mb-4">

              Low Stock Warnings

            </h2>

            <div className="space-y-3">

              {inventory

                .filter((item) =>
                  isLowStock(item)
                )

                .map((item) => (

                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl font-bold text-red-600"
                  >

                    ⚠ {item.name} stock is low
                    ({item.quantity} {item.unit}
                    remaining)

                  </div>
                ))}

            </div>

          </div>
        )}

        {/* ADD INVENTORY */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Add Inventory

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="Material Name"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

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

            <input
              type="text"
              placeholder="Unit"

              value={unit}

              onChange={(e) =>
                setUnit(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />
            <input
  type="text"
  placeholder="Supplier"

  value={supplier}

  onChange={(e) =>
    setSupplier(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

<input
  type="text"
  placeholder="Invoice Number"

  value={invoiceNumber}

  onChange={(e) =>
    setInvoiceNumber(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

          </div>

          <button
            onClick={addInventory}

            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold"
          >

            Add Inventory

          </button>

        </div>

        {/* INVENTORY TABLE */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Inventory Ledger

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Material

                  </th>

                  <th className="p-4 text-left">

                    Quantity

                  </th>

                  <th className="p-4 text-left">

                    Unit

                  </th>

                  <th className="p-4 text-left">

                    Status

                  </th>

                </tr>

              </thead>

              <tbody>

                {inventory.map(
                  (item) => {

                    const lowStock =
                      isLowStock(item);

                    return (

                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-4 font-semibold">

                          {item.name}

                        </td>

                        <td className="p-4 font-bold">

                          {item.quantity}

                        </td>

                        <td className="p-4">

                          {item.unit}

                        </td>

                        <td className="p-4">

                          {lowStock ? (

                            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold">

                              Low Stock

                            </span>

                          ) : (

                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">

                              Healthy

                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </ProtectedRoute>
  );
}