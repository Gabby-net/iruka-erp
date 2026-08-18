"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

import ProductionStats from "@/components/production/ProductionStats";

import ProductionForm from "@/components/production/ProductionForm";

import RecipePreview from "@/components/production/RecipePreview";

import ProductionHistory from "@/components/production/ProductionHistory";

export default function ProductionPage() {

  /* =========================
     STATES
  ========================== */

  const [products, setProducts] =
    useState<any[]>([]);

  const [productionLogs, setProductionLogs] =
    useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [shift, setShift] =
    useState("Morning");

  const [quantityProduced, setQuantityProduced] =
    useState("");

  const [wasteQuantity, setWasteQuantity] =
    useState("");
 const [doughBatches, setDoughBatches] =
  useState("");

  const [selectedProduction, setSelectedProduction] =
  useState<any>(null);

const [showProductionDetails, setShowProductionDetails] =
  useState(false);

  const [historySearch, setHistorySearch] =
  useState("");

const [historyLimit, setHistoryLimit] =
  useState(10);

  const selectedProductData = products.find(
  (product) => product.name === selectedProduct
);

const selectedRecipeName =
  selectedProductData?.recipe_name || "";
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

    /* PRODUCTION LOGS */

    const {
      data: productionData,
    } = await supabase

      .from("production_logs")

      .select("*")

      .order("created_at", {
        ascending: false,
      });
      console.log("Production Logs:", productionData);

    setProducts(productsData || []);

console.log(productionData);

    setProductionLogs(
      productionData || []
    );
  }

  /* =========================
     SAVE PRODUCTION
  ========================== */

  async function saveProduction() {

   if (saving) return;

setSaving(true);

    if (
      !selectedProduct ||
      !quantityProduced
    ) {

      alert(
        "Fill all required fields"
      );

      return;
    }

    /* =========================
       SAVE PRODUCTION LOG
    ========================== */

/* =========================
   RECIPE MAPPING
========================== */

let recipeName = "";

if (
  [
    "Small Iruka",
    "Medium Iruka",
    "Classic Iruka",
    "Jumbo Iruka",
    "Big Smart",
  ].includes(selectedProduct)
) {

  recipeName = "Iruka Recipe";

}

else if (
  [
    "Small Rosy",
    "Medium Rosy",
    "Big Brother Family",
  ].includes(selectedProduct)
) {

  recipeName = "White Recipe";

}

else if (
  [
    "Classic Fruits",
    "Jumbo Fruits",
  ].includes(selectedProduct)
) {

  recipeName = "Fruits Recipe";

}

if (!recipeName) {
  alert("Recipe mapping not found.");
  setSaving(false);
  return;
}

const { data, error } = await supabase
  .from("production_logs")
  .insert([
    {
      product_id: selectedProductData?.id || null,
      bread: selectedProduct,
      quantity: Number(quantityProduced),
      waste_quantity: Number(wasteQuantity || 0),
      dough_batches: Number(doughBatches || 0),
      produced_by: "Production Staff",
      batch: `IRK-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`,
      shift,
      team: "A",
      status: "Completed",
      production_date: new Date().toISOString().split("T")[0],
    },
  ])
  .select();

if (error) {
  console.error("Production insert error:", error);
  alert(error.message);
  setSaving(false);
  return;
}

console.log("Production inserted:", data);

/* UPDATE FINISHED GOODS STOCK */

if (selectedProductData) {

  const currentStock =
    Number(selectedProductData.stock || 0);

  const produced =
    Number(quantityProduced || 0);

  const waste =
    Number(wasteQuantity || 0);

  const netProduction =
    produced - waste;

  await supabase
    .from("products")
    .update({
      stock:
        currentStock +
        netProduction,
    })
    .eq(
      "id",
      selectedProductData.id
    );
}

    /* =========================
       GET INVENTORY
    ========================== */

    const {
      data: inventory,
    } = await supabase

      .from("inventory")

      .select("*");

    /* =========================
       FIND MATERIALS
    ========================== */

const flour =
  inventory?.find(
    (item) =>
      item.name ===
      "Flour"
  );

const sugar =
  inventory?.find(
    (item) =>
      item.name ===
      "Sugar"
  );

const butter =
  inventory?.find(
    (item) =>
      item.name ===
      "Butter"
  );

const yeast =
  inventory?.find(
    (item) =>
      item.name ===
      "Yeast"
  );

const resins =
  inventory?.find(
    (item) =>
      item.name ===
      "Resins"
  );

const brown =
  inventory?.find(
    (item) =>
      item.name ===
      "Brown"
  );

const groundnutOil =
  inventory?.find(
    (item) =>
      item.name ===
      "Groundnut Oil"
  );

  const recipeInventory =
  inventory?.find(
    (item) =>
      item.name === recipeName
  );

const tape =
  inventory?.find(
    (item) =>
      item.name ===
      "Tape"
  );

const twist =
  inventory?.find(
    (item) =>
      item.name ===
      "Twist"
  );

    /* =========================
       PRODUCT OUTPUT RATIOS
    ========================== */


    /* =========================
   MATERIAL USAGE
========================== */

const batches =
Number(doughBatches);

/* =========================
   INVENTORY VALIDATION
========================== */

const flourNeeded = batches * 2;

const sugarNeeded = (batches * 12) / 50;

const butterNeeded = (batches * 1.35) / 15;

const yeastNeeded = batches;

const groundnutOilNeeded = (batches * 0.23) / 23;

const recipeNeeded = batches;

const resinNeeded =
  selectedProduct === "Small Rosy" ||
  selectedProduct === "Big Brother Family"
    ? batches / 10
    : 0;

if (Number(flour?.quantity || 0) < flourNeeded) {
  alert("Not enough Flour.");
  return;
}

if (Number(sugar?.quantity || 0) < sugarNeeded) {
  alert("Not enough Sugar.");
  return;
}

if (Number(butter?.quantity || 0) < butterNeeded) {
  alert("Not enough Butter.");
  return;
}

if (Number(yeast?.quantity || 0) < yeastNeeded) {
  alert("Not enough Yeast.");
  return;
}

if (Number(groundnutOil?.quantity || 0) < groundnutOilNeeded) {
  alert("Not enough Groundnut Oil.");
  return;
}

if (
  Number(recipeInventory?.quantity || 0) < recipeNeeded
) {
  alert(`Not enough ${recipeName}.`);
  return;
}

if (
  resinNeeded > 0 &&
  Number(resins?.quantity || 0) < resinNeeded
) {
  alert("Not enough Resins.");
  return;
}

/* =========================
   MATERIAL DEDUCTIONS
========================== */

const flourUsed = flourNeeded;

const sugarUsed = sugarNeeded;

const butterUsed = butterNeeded;

const yeastUsed = yeastNeeded;

const groundnutOilUsed = groundnutOilNeeded;

const recipeUsed = recipeNeeded;

const resinUsed = resinNeeded;

    /* =========================
       UPDATE INVENTORY
    ========================== */

    if (flour) {

      await supabase

        .from("inventory")

        .update({
          quantity:
            Number(
              flour.quantity
            ) - flourUsed,
        })

        .eq(
          "id",
          flour.id
        );
    }

    if (sugar) {

      await supabase

        .from("inventory")

        .update({
          quantity:
            Number(
              sugar.quantity
            ) - sugarUsed,
        })

        .eq(
          "id",
          sugar.id
        );
    }

    if (butter) {

      await supabase

        .from("inventory")

        .update({
          quantity:
            Number(
              butter.quantity
            ) - butterUsed,
        })

        .eq(
          "id",
          butter.id
        );
    }

    if (yeast) {

      await supabase

        .from("inventory")

        .update({
          quantity:
            Number(
              yeast.quantity
            ) - yeastUsed,
        })

        .eq(
          "id",
          yeast.id
        );
    }

    if (groundnutOil) {

  await supabase
    .from("inventory")
    .update({
      quantity:
        Number(groundnutOil.quantity) -
        groundnutOilUsed,
    })
    .eq("id", groundnutOil.id);

}

/* =========================
   DEDUCT RECIPE PACKS
========================== */

if (recipeInventory) {

  await supabase
    .from("inventory")
    .update({
      quantity:
        Number(recipeInventory.quantity) -
        recipeUsed,
    })
    .eq("id", recipeInventory.id);

}

/* =========================
   DEDUCT RESINS
========================== */

if (resins && resinUsed > 0) {

  await supabase
    .from("inventory")
    .update({
      quantity:
        Number(resins.quantity) -
        resinUsed,
    })
    .eq("id", resins.id);

}

/* =========================
   INVENTORY HISTORY
========================== */

const transactions = [
  {
    material_name: "Flour",
    quantity_used: flourUsed,
  },
  {
    material_name: "Sugar",
    quantity_used: sugarUsed,
  },
  {
    material_name: "Butter",
    quantity_used: butterUsed,
  },
  {
    material_name: "Yeast",
    quantity_used: yeastUsed,
  },
  {
    material_name: "Groundnut Oil",
    quantity_used: groundnutOilUsed,
  },
  {
    material_name: recipeName,
    quantity_used: recipeUsed,
  },
];

if (resinUsed > 0) {
  transactions.push({
    material_name: "Resins",
    quantity_used: resinUsed,
  });
}

await supabase
  .from("inventory_transactions")
  .insert(
    transactions.map((item) => ({
      material_name: item.material_name,
      quantity_used: item.quantity_used,
      transaction_type: "AUTO_DEDUCTION",
      reference: `${selectedProduct} Production`,
      created_at: new Date().toISOString(),
    }))
  );

/* =========================
   REFRESH & RESET
========================== */

await fetchData();

console.log("After upload:", productionLogs);

setSelectedProduct("");
setQuantityProduced("");
setWasteQuantity("");
setDoughBatches("");
setShift("Morning");

setSaving(false);

alert("successfully!");

await supabase
  .from("inventory_transactions")
  .insert(
    transactions.map((item) => ({
      material_name: item.material_name,
      quantity_used: item.quantity_used,
      transaction_type: "AUTO_DEDUCTION",
      reference: `${selectedProduct} Production`,
      created_at: new Date().toISOString(),
    }))
  );
console.log("After upload:", productionLogs);

setSelectedProduct("");
setQuantityProduced("");
setWasteQuantity("");
setDoughBatches("");
setShift("Morning");

alert("Production uploaded successfully!");
setSaving(false);
    /* =========================
       RESET
    ========================== */

    setSelectedProduct("");

    setQuantityProduced("");

    setWasteQuantity("");

    setShift("Morning");

    fetchData();

    alert(
      "Production uploaded & inventory deducted successfully"
    );
  }

  /* =========================
     TOTALS
  ========================== */

/* ==========================================
        TODAY'S PRODUCTION ONLY
========================================== */

const today = new Date().toISOString().split("T")[0];

const todaysLogs = productionLogs.filter(
(item)=>
item.production_date===today
);

const totalProduced =
todaysLogs.reduce(
(sum,item)=>
sum + Number(item.quantity || 0),
0
);

const totalWaste =
todaysLogs.reduce(
(sum,item)=>
sum + Number(item.waste_quantity || 0),
0
);

const totalDoughBatches =
todaysLogs.reduce(
(sum,item)=>
sum + Number(item.dough_batches || 0),
0
);

const netProduction =
totalProduced - totalWaste;

/* ==========================================
      PRODUCTION HISTORY
========================================== */

const filteredHistory = productionLogs
  .filter((item) => {

    const search =
      historySearch.toLowerCase();

    return (

      (item.bread || "")
        .toLowerCase()
        .includes(search)

      ||

      (item.batch || "")
        .toLowerCase()
        .includes(search)

      ||

      (item.shift || "")
        .toLowerCase()
        .includes(search)

      ||

      (item.status || "")
        .toLowerCase()
        .includes(search)

    );

  })
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

const displayedHistory =
  filteredHistory.slice(
    0,
    historyLimit
  );

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "production",
      ]}
    >

      <div className="min-h-screen bg-[#08111f] -m-6 p-8">

{/* ==========================================
            HEADER
========================================== */}

<div className="flex flex-col xl:flex-row justify-between xl:items-center gap-8 mb-10">

  <div>

    <h1 className="text-5xl font-black text-white">

      Production Center

    </h1>

    <p className="text-slate-400 mt-3 text-lg">

      Live bakery production, dough tracking and inventory automation

    </p>

  </div>

  <div className="bg-slate-900 border border-slate-700 rounded-3xl px-8 py-6">

    <p className="text-slate-400">

      Today

    </p>

    <h2 className="text-2xl font-bold text-white mt-2">

      {new Date().toLocaleDateString("en-GB",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric",
      })}

    </h2>

    <p className="text-yellow-400 mt-3 font-semibold">

      Production Operations

    </p>

  </div>

</div>

{/* ==========================================
            KPI CARDS
========================================== */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

  {/* Today's Production */}

  <div className="rounded-3xl border border-blue-800 bg-gradient-to-br from-slate-900 to-blue-950 p-7 shadow-xl">

    <p className="text-blue-300 text-sm uppercase tracking-wider">

      Today's Production

    </p>

    <h2 className="text-5xl font-black text-white mt-4">

      {totalProduced.toLocaleString()}

    </h2>

    <p className="text-blue-200 mt-3">

      Pieces Produced

    </p>

  </div>

  {/* Waste */}

  <div className="rounded-3xl border border-red-800 bg-gradient-to-br from-slate-900 to-red-950 p-7 shadow-xl">

    <p className="text-red-300 text-sm uppercase tracking-wider">

      Waste

    </p>

    <h2 className="text-5xl font-black text-red-400 mt-4">

      {totalWaste.toLocaleString()}

    </h2>

    <p className="text-red-200 mt-3">

      Damaged Pieces

    </p>

  </div>

  {/* Net Production */}

  <div className="rounded-3xl border border-green-800 bg-gradient-to-br from-slate-900 to-green-950 p-7 shadow-xl">

    <p className="text-green-300 text-sm uppercase tracking-wider">

      Net Production

    </p>

    <h2 className="text-5xl font-black text-green-400 mt-4">

      {netProduction.toLocaleString()}

    </h2>

    <p className="text-green-200 mt-3">

      Added To Stock

    </p>

  </div>

  {/* Dough Batches */}

  <div className="rounded-3xl border border-yellow-800 bg-gradient-to-br from-slate-900 to-yellow-950 p-7 shadow-xl">

    <p className="text-yellow-300 text-sm uppercase tracking-wider">

      Dough Batches

    </p>

    <h2 className="text-5xl font-black text-yellow-400 mt-4">

      {totalDoughBatches.toLocaleString()}

    </h2>

    <p className="text-yellow-200 mt-3">

      Mixed Today

    </p>

  </div>

</div>

{/* ==========================================
        PRODUCTION WORKSPACE
========================================== */}

<div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-10">

  {/* RECORD PRODUCTION */}

  <div className="xl:col-span-3 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">

    <div className="px-8 py-6 border-b border-slate-700">

      <h2 className="text-3xl font-bold text-white">

        Record Production

      </h2>

      <p className="text-slate-400 mt-2">

        Upload today's bakery production and automatically update inventory.

      </p>

    </div>

    <div className="p-8">

      <ProductionForm
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        quantityProduced={quantityProduced}
        setQuantityProduced={setQuantityProduced}
        wasteQuantity={wasteQuantity}
        setWasteQuantity={setWasteQuantity}
        doughBatches={doughBatches}
        setDoughBatches={setDoughBatches}
        shift={shift}
        setShift={setShift}
        saveProduction={saveProduction}
        saving={saving}
      />

    </div>

  </div>

  {/* LIVE RECIPE */}

  <div className="xl:col-span-2 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">

    <div className="px-8 py-6 border-b border-slate-700">

      <h2 className="text-3xl font-bold text-white">

        Live Recipe Preview

      </h2>

      <p className="text-slate-400 mt-2">

        Ingredient deduction before production is uploaded.

      </p>

    </div>

    <div className="p-8">

      <RecipePreview
        selectedProduct={selectedProduct}
        doughBatches={doughBatches}
        recipeName={selectedRecipeName}
      />

    </div>

  </div>

</div>

{/* ==========================================
        PRODUCTION HISTORY
========================================== */}

<div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden mt-10">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-8 py-6 border-b border-slate-700">

    <div>

      <h2 className="text-3xl font-bold text-white">

        Production History

      </h2>

      <p className="text-slate-400 mt-2">

        Latest production uploaded to the database

      </p>

    </div>

    <input
      type="text"
      placeholder="Search product, batch, shift..."
      value={historySearch}
      onChange={(e)=>setHistorySearch(e.target.value)}
      className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white w-full lg:w-80 outline-none focus:border-yellow-500"
    />

  </div>

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-800">

        <tr>

          <th className="px-6 py-4 text-left text-slate-300">Product</th>

          <th className="px-6 py-4 text-center text-slate-300">Shift</th>

          <th className="px-6 py-4 text-center text-slate-300">Dough</th>

          <th className="px-6 py-4 text-center text-slate-300">Produced</th>

          <th className="px-6 py-4 text-center text-slate-300">Waste</th>

          <th className="px-6 py-4 text-center text-slate-300">Net</th>

          <th className="px-6 py-4 text-center text-slate-300">Status</th>

          <th className="px-6 py-4 text-center text-slate-300">Date</th>

        </tr>

      </thead>

      <tbody>

        {displayedHistory.length === 0 && (

          <tr>

            <td
              colSpan={8}
              className="text-center py-16 text-slate-400"
            >

              No production history found.

            </td>

          </tr>

        )}

        {displayedHistory.map((log,index)=>{

          const net =
            Number(log.quantity||0) -
            Number(log.waste_quantity||0);

          return(

            <tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-800/40 transition"
            >

              <td className="px-6 py-5">

                <div>

                  <p className="font-bold text-white">

                    {log.bread}

                  </p>

                  <p className="text-xs text-slate-400">

                    {log.batch}

                  </p>

                </div>

              </td>

              <td className="px-6 py-5 text-center">

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  log.shift==="Morning"
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-indigo-500/20 text-indigo-300"
                }`}>

                  {log.shift}

                </span>

              </td>

              <td className="px-6 py-5 text-center text-yellow-400 font-bold">

                {log.dough_batches}

              </td>

              <td className="px-6 py-5 text-center text-blue-300 font-bold">

                {Number(log.quantity).toLocaleString()}

              </td>

              <td className="px-6 py-5 text-center text-red-400 font-bold">

                {Number(log.waste_quantity).toLocaleString()}

              </td>

              <td className="px-6 py-5 text-center text-green-400 font-bold">

                {net.toLocaleString()}

              </td>

              <td className="px-6 py-5 text-center">

                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold">

                  {log.status}

                </span>

              </td>

              <td className="px-6 py-5 text-center text-slate-300">

                {new Date(
                  log.created_at
                ).toLocaleString()}

              </td>

            </tr>

          );

        })}

      </tbody>

    </table>

  </div>

  {filteredHistory.length > historyLimit && (

    <div className="p-6 border-t border-slate-700 flex justify-center">

      <button

        onClick={()=>
          setHistoryLimit(
            historyLimit+10
          )
        }

        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl transition"

      >

        Load More

      </button>

    </div>

  )}

</div>


        </div>

    </ProtectedRoute>
  );
}