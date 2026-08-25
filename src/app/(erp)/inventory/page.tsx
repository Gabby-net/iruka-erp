"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import InventoryMaterials from "@/components/inventory/InventoryMaterials";

import InventoryHistory from "@/components/inventory/InventoryHistory";

import InventorySummary from "@/components/inventory/InventorySummary";

import IssueMaterialForm from "@/components/inventory/IssueMaterialForm";

import { supabase } from "@/lib/supabase";

export default function InventoryPage() {

  /* =========================
     STATES
  ========================== */

  const [inventory, setInventory] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

    const [transactions, setTransactions] =
  useState<any[]>([]);

  const [quantity, setQuantity] =
    useState("");

  const [issueMaterialName, setIssueMaterialName] = useState("");

const [issueQuantity, setIssueQuantity] = useState("");  

  const [unit, setUnit] =
    useState("");  

  useEffect(() => {

    fetchInventory();

  }, []);

  /* =========================
     FETCH INVENTORY
  ========================== */

async function fetchInventory() {

  /* FETCH INVENTORY */

  const { data } =
    await supabase
      .from("inventory")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  setInventory(data || []);

  /* FETCH INVENTORY HISTORY */

  const { data: history } =
    await supabase
      .from("inventory_transactions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  setTransactions(history || []);

}

 /* =========================
   ISSUE MATERIAL
========================== */

async function issueMaterial() {

  if (!issueMaterialName || !issueQuantity) {
    alert("Select a material and quantity.");
    return;
  }

  const item = inventory.find(
    (i) => i.name === issueMaterialName
  );

  if (!item) {
    alert("Material not found.");
    return;
  }

  const currentQuantity = Number(item.quantity);
  const quantityToIssue = Number(issueQuantity);

  if (quantityToIssue > currentQuantity) {
    alert("Insufficient stock.");
    return;
  }

  await supabase
    .from("inventory")
    .update({
      quantity: currentQuantity - quantityToIssue,
    })
    .eq("id", item.id);

const { error } = await supabase
  .from("inventory_transactions")
  .insert([
    {
      material_name: issueMaterialName,
      quantity_used: quantityToIssue,
      transaction_type: "ISSUED",
      reference: "Manual Material Issue",
    },
  ]);

if (error) {
  console.error(error);
  alert(error.message);
  return;
}

  setIssueMaterialName("");
  setIssueQuantity("");

  fetchInventory();
}

/* =========================
   ADD INVENTORY
========================== */

async function addInventory() {

  if (!name || !quantity) {
    alert("Fill all fields");
    return;
  }

  const existingMaterial = inventory.find(
    (item) =>
      item.name.toLowerCase().trim() ===
      name.toLowerCase().trim()
  );

  if (existingMaterial) {

    const newQuantity =
      Number(existingMaterial.quantity) +
      Number(quantity);

    await supabase
      .from("inventory")
      .update({
        quantity: newQuantity,
      })
      .eq("id", existingMaterial.id);

  } else {

    await supabase
      .from("inventory")
      .insert([
        {
          name,
          quantity: Number(quantity),
          unit,
        },
      ]);

  }

const { data, error } = await supabase
  .from("inventory_transactions")
  .insert([
    {
      material_name: name,
      quantity_used: Number(quantity),
      transaction_type: "RECEIVED",
      reference: "Manual Stock Entry",
    },
  ])
  .select();

console.log("Transaction Data:", data);
console.log("Transaction Error:", error);

if (error) {
  alert(error.message);
  return;
}

  setName("");
  setQuantity("");
  setUnit("");

  fetchInventory();

  alert("Inventory received successfully");
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
console.log(transactions);
  return (

    <ProtectedRoute
  allowedRoles={[
    "admin",
    "inventory",
  ]}
>

      <div className="min-h-screen p-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">

        {/* HEADER */}

<div className="mb-10 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">

  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-10">

    <div className="flex items-center justify-between">

<div>

  <div className="flex items-center gap-3 mb-4">

    <span className="inline-flex items-center rounded-full bg-amber-500/20 text-amber-300 px-4 py-1 text-sm font-bold">
      📦 INVENTORY MANAGEMENT
    </span>

    <span className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 px-4 py-1 text-sm">
      📅 {new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>

  </div>

  <h1 className="text-5xl font-black text-white">
    Smart Inventory Control
  </h1>

  <p className="text-slate-300 mt-3 text-lg">
    Monitor inventory levels, stock movements, recipe materials and warehouse operations.
  </p>

</div>

      <div className="hidden lg:flex items-center justify-center w-28 h-28 rounded-full bg-amber-500/10 border border-amber-400/30 text-6xl">
        📦
      </div>

    </div>

  </div>

</div>

<InventorySummary
  totalMaterials={totalMaterials}
  lowStockCount={lowStockCount}
/>
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
                    className="bg-slate-900 border border-slate-700 p-4 rounded-2xl font-bold text-red-600"
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

        <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Add Inventory

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

<select
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-400"
>
  <option value="">Select Material</option>

  <optgroup label="🍞 Production Ingredients">
    <option value="Flour">Flour</option>
    <option value="Sugar">Sugar</option>
    <option value="Butter">Butter</option>
    <option value="Yeast">Yeast</option>
    <option value="Groundnut Oil">Groundnut Oil</option>
  </optgroup>

  <optgroup label="🥖 Bakery Recipes">
    <option value="Iruka Recipe">Iruka Recipe</option>
    <option value="White Recipe">White Recipe</option>
    <option value="Fruits Recipe">Fruits Recipe</option>
  </optgroup>

<optgroup label="📦 Nylon Packaging">

  <option value="Small Iruka Nylon">
    Small Iruka Nylon
  </option>

  <option value="Small Rosy Nylon">
    Small Rosy Nylon
  </option>

  <option value="Medium Iruka Nylon">
    Medium Iruka Nylon
  </option>

  <option value="Medium Rosy Nylon">
    Medium Rosy Nylon
  </option>

  <option value="Big Smart Nylon">
    Big Smart Nylon
  </option>

  <option value="Classic Iruka Nylon">
    Classic Iruka Nylon
  </option>

  <option value="Classic Fruits Nylon">
    Classic Fruits Nylon
  </option>

  <option value="Jumbo Iruka Nylon">
    Jumbo Iruka Nylon
  </option>

  <option value="Jumbo Fruits Nylon">
    Jumbo Fruits Nylon
  </option>

  <option value="Big Brother Family Nylon">
    Big Brother Family Nylon
  </option>

</optgroup>

<optgroup label="📦 Other Packaging">

  <option value="Tape">
    Tape
  </option>

  <option value="Twist">
    Twist
  </option>

</optgroup>

  <optgroup label="🧪 Bakery Additives">
    <option value="Brown">Brown</option>
    <option value="Resins">Resins</option>
    <option value="Flavour">Flavour</option>
  </optgroup>
</select>

            <input
              type="number"
              placeholder="Quantity"

              value={quantity}

              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }

              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
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

              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />


          </div>

          <button
            onClick={addInventory}

            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold"
          >

            Add Inventory

          </button>

        </div>

        <IssueMaterialForm
  material={issueMaterialName}
  setMaterial={setIssueMaterialName}
  quantity={issueQuantity}
  setQuantity={setIssueQuantity}
  issueMaterial={issueMaterial}
/>

        {/* INVENTORY TABLE */}

<InventoryMaterials
  inventory={inventory}
  isLowStock={isLowStock}
/>

<div className="mt-10">

  <h2 className="text-3xl font-black text-blue-950 mb-6">

    🥖 Recipe Inventory

  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    {inventory
      .filter((item) =>
        [
          "Iruka Recipe",
          "White Recipe",
          "Fruits Recipe",
        ].includes(item.name)
      )
      .map((item) => (

        <div
          key={item.id}
          className="rounded-3xl p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl"
        >

          <h3 className="text-2xl font-black">

            {item.name}

          </h3>

          <p className="text-5xl font-black mt-4">

            {item.quantity}

          </p>

          <p className="opacity-90">

            Recipe Packs

          </p>

        </div>

      ))}

  </div>

</div>

<InventoryHistory
  transactions={transactions}
/>

        </div>


    </ProtectedRoute>
  );
}