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

  if (!selectedProduct || !quantityProduced) {
    alert("Fill all required fields.");
    return;
  }

  const batches = Number(doughBatches || 0);
  const produced = Number(quantityProduced || 0);
  const waste = Number(wasteQuantity || 0);

  if (produced <= 0) {
    alert("Production quantity must be greater than 0.");
    return;
  }

  if (batches <= 0) {
    alert("Dough batches must be greater than 0.");
    return;
  }

  setSaving(true);

  try {
    /* =========================
       SELECTED PRODUCT
    ========================== */

    const product = products.find(
      (item) => item.name === selectedProduct
    );

    if (!product) {
      throw new Error("Selected product was not found.");
    }

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
    } else if (
      [
        "Small Rosy",
        "Medium Rosy",
        "Big Brother Family",
      ].includes(selectedProduct)
    ) {
      recipeName = "White Recipe";
    } else if (
      [
        "Classic Fruits",
        "Jumbo Fruits",
      ].includes(selectedProduct)
    ) {
      recipeName = "Fruits Recipe";
    }

    if (!recipeName) {
      throw new Error("Recipe mapping not found.");
    }

    /* =========================
       GET INVENTORY
    ========================== */

    const {
      data: inventory,
      error: inventoryError,
    } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      throw new Error(inventoryError.message);
    }

    /* =========================
       FIND MATERIALS
    ========================== */

    const flour = inventory?.find(
      (item) => item.name === "Flour"
    );

    const sugar = inventory?.find(
      (item) => item.name === "Sugar"
    );

    const butter = inventory?.find(
      (item) => item.name === "Butter"
    );

    const yeast = inventory?.find(
      (item) => item.name === "Yeast"
    );

    const groundnutOil = inventory?.find(
      (item) => item.name === "Groundnut Oil"
    );

    const resins = inventory?.find(
      (item) => item.name === "Resins"
    );

    const recipeInventory = inventory?.find(
      (item) => item.name === recipeName
    );

    const brown = inventory?.find(
  (item) => item.name === "Brown"
);

const flavour = inventory?.find(
  (item) => item.name === "Flavour"
);

const tape = inventory?.find(
  (item) => item.name === "Tape"
);

const twist = inventory?.find(
  (item) => item.name === "Twist"
);

/* =========================
   PRODUCT-SPECIFIC NYLON
========================== */

const nylonNameMap: Record<string, string> = {

  "Small Iruka":
    "Small Iruka Nylon",

  "Small Rosy":
    "Small Rosy Nylon",

  "Medium Iruka":
    "Medium Iruka Nylon",

  "Medium Rosy":
    "Medium Rosy Nylon",

  "Big Smart":
    "Big Smart Nylon",

  "Classic Iruka":
    "Classic Iruka Nylon",

  "Classic Fruits":
    "Classic Fruits Nylon",

  "Jumbo Iruka":
    "Jumbo Iruka Nylon",

  "Jumbo Fruits":
    "Jumbo Fruits Nylon",

  "Big Brother Family":
    "Big Brother Family Nylon",

};

const nylonName =
  nylonNameMap[selectedProduct];

const nylon =
  inventory?.find(
    (item) =>
      item.name === nylonName
  );

/* =========================
   AUTOMATIC MATERIAL CALCULATIONS
   BASED ON DOUGH BATCHES
========================== */

/* CORE PRODUCTION MATERIALS */

const flourNeeded = batches * 2;

const sugarNeeded =
  (batches * 12) / 50;

const butterNeeded =
  (batches * 1.35) / 15;

const yeastNeeded = batches;

const groundnutOilNeeded =
  (batches * 0.23) / 23;


/* =========================
   RECIPE PACK
========================== */

const recipeNeeded = batches;


/* =========================
   BROWN
   0.5 L per dough batch
   ONLY:
   Small Iruka
   Big Smart
   Medium Iruka
   Classic Iruka
   Jumbo Iruka
========================== */

const brownNeeded =
  [
    "Small Iruka",
    "Big Smart",
    "Medium Iruka",
    "Classic Iruka",
    "Jumbo Iruka",
  ].includes(selectedProduct)
    ? batches * 0.5
    : 0;


/* =========================
   FLAVOUR
   0.25 KG per dough batch
   ALL PRODUCTS
========================== */

const flavourNeeded =
  batches * 0.25;


/* =========================
   TAPE
   0.8181 per dough batch
   ONLY:
   Small Iruka
   Small Rosy
========================== */

const tapeNeeded =
  [
    "Small Iruka",
    "Small Rosy",
  ].includes(selectedProduct)
    ? batches * 0.8181
    : 0;


/* =========================
   TWIST
   1 STRIP PER PIECE
   Inventory stores 600 strips per pack

   Therefore:
   pieces / 600 = packs used
========================== */

const twistNeeded =
  [
    "Big Smart",
    "Medium Rosy",
    "Medium Iruka",
    "Jumbo Fruits",
    "Jumbo Iruka",
    "Classic Fruits",
    "Classic Iruka",
    "Big Brother Family",
  ].includes(selectedProduct)
    ? produced / 600
    : 0;


/* =========================
   NYLON
   1 nylon per piece
   ALL 10 PRODUCTS
========================== */

const nylonNeeded =
  produced;


/* =========================
   RESINS
   1 KG per dough batch
   ONLY:
   Big Brother Family
   Small Rosy
   Jumbo Fruits
========================== */

/* =========================
   RESINS
   1 KG PER DOUGH BATCH
   PRODUCTS:
   Small Rosy
   Classic Fruits
   Jumbo Fruits
   Big Brother Family

   INVENTORY IS STORED IN CARTONS
   1 CARTON = 10 KG
========================== */

const resinNeededKg =
  [
    "Small Rosy",
    "Classic Fruits",
    "Jumbo Fruits",
    "Big Brother Family",
  ].includes(selectedProduct)
    ? batches
    : 0;

/*
 * Convert KG consumption into cartons
 *
 * 1 carton = 10kg
 */
const resinNeededCartons =
  resinNeededKg / 10;

/* =========================
   INVENTORY VALIDATION
========================== */

const requiredMaterials = [

  /* =========================
     FLOUR
     2 BAGS PER DOUGH BATCH
  ========================== */

  {
    item: flour,
    name: "Flour",
    amount: flourNeeded,
  },

  /* =========================
     SUGAR
     12 KG PER DOUGH BATCH
     INVENTORY STORED IN 50KG BAGS
  ========================== */

  {
    item: sugar,
    name: "Sugar",
    amount: sugarNeeded,
  },

  /* =========================
     BUTTER
     1.35 KG PER DOUGH BATCH
     INVENTORY STORED IN 15KG UNITS
  ========================== */

  {
    item: butter,
    name: "Butter",
    amount: butterNeeded,
  },

  /* =========================
     YEAST
     1 UNIT PER DOUGH BATCH
  ========================== */

  {
    item: yeast,
    name: "Yeast",
    amount: yeastNeeded,
  },

  /* =========================
     GROUNDNUT OIL
     0.23 KG PER DOUGH BATCH
     INVENTORY STORED IN 23KG UNITS
  ========================== */

  {
    item: groundnutOil,
    name: "Groundnut Oil",
    amount: groundnutOilNeeded,
  },

  /* =========================
     RECIPE
     1 PACK PER DOUGH BATCH
  ========================== */

  {
    item: recipeInventory,
    name: recipeName,
    amount: recipeNeeded,
  },

  /* =========================
     FLAVOUR
     0.25 KG PER DOUGH BATCH
  ========================== */

  {
    item: flavour,
    name: "Flavour",
    amount: flavourNeeded,
  },

  /* =========================
     PRODUCT-SPECIFIC NYLON
     1 NYLON PER PRODUCED PIECE
  ========================== */

  {
    item: nylon,
    name: nylonName,
    amount: nylonNeeded,
  },

  /* =========================
     BROWN
     0.5 L PER DOUGH BATCH

     PRODUCTS:
     Small Iruka
     Big Smart
     Medium Iruka
     Classic Iruka
     Jumbo Iruka
  ========================== */

  ...(brownNeeded > 0
    ? [
        {
          item: brown,
          name: "Brown",
          amount: brownNeeded,
        },
      ]
    : []),

  /* =========================
     TAPE
     0.8181 PACK PER DOUGH BATCH

     PRODUCTS:
     Small Iruka
     Small Rosy
  ========================== */

  ...(tapeNeeded > 0
    ? [
        {
          item: tape,
          name: "Tape",
          amount: tapeNeeded,
        },
      ]
    : []),

  /* =========================
     TWIST
     1 STRIP PER PIECE
     600 STRIPS = 1 PACK

     Therefore:
     produced / 600
  ========================== */

  ...(twistNeeded > 0
    ? [
        {
          item: twist,
          name: "Twist",
          amount: twistNeeded,
        },
      ]
    : []),

  /* =========================
     RESINS
     1 KG PER DOUGH BATCH

     INVENTORY:
     1 CARTON = 10 KG
  ========================== */

  ...(resinNeededCartons > 0
    ? [
        {
          item: resins,
          name: "Resins",
          amount: resinNeededCartons,
        },
      ]
    : []),

];


/* =========================
   CHECK MATERIALS EXIST
========================== */

for (const material of requiredMaterials) {

  if (!material.item) {
    throw new Error(
      `${material.name} inventory item not found.`
    );
  }

}


/* =========================
   CHECK ENOUGH STOCK
========================== */

for (const material of requiredMaterials) {

  const available =
    Number(material.item.quantity || 0);

  if (available < material.amount) {

    throw new Error(
      `Not enough ${material.name}. Required: ${material.amount}, Available: ${available}`
    );

  }

}


/* =========================
   CREATE BATCH NUMBER
========================== */

const batchNumber =
  `IRK-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.floor(
    Math.random() * 900 + 100
  )}`;


/* =========================
   1. INSERT PRODUCTION LOG
========================== */

const {
  data: productionData,
  error: productionError,
} = await supabase
  .from("production_logs")
  .insert([
    {
      product_id: product.id,
      bread: selectedProduct,
      quantity: produced,
      waste_quantity: waste,
      dough_batches: batches,
      produced_by: "Production Staff",
      batch: batchNumber,
      shift: shift,
      team: "A",
      status: "Completed",
      production_date:
        new Date()
          .toISOString()
          .split("T")[0],
    },
  ])
  .select()
  .single();

if (productionError) {

  throw new Error(
    `Production save failed: ${productionError.message}`
  );

}

console.log(
  "Production created:",
  productionData
);


/* =========================
   2. UPDATE FINISHED GOODS
========================== */

const netProduction =
  produced - waste;

const {
  error: productError,
} = await supabase
  .from("products")
  .update({
    stock:
      Number(product.stock || 0) +
      netProduction,
  })
  .eq("id", product.id);

if (productError) {

  throw new Error(
    `Product stock update failed: ${productError.message}`
  );

}


/* =========================
   3. AUTOMATICALLY DEDUCT
      ALL PRODUCTION MATERIALS
========================== */

for (const material of requiredMaterials) {

  const newQuantity =
    Number(material.item.quantity || 0) -
    material.amount;

  const {
    error: deductionError,
  } = await supabase
    .from("inventory")
    .update({
      quantity: newQuantity,
    })
    .eq("id", material.item.id);

  if (deductionError) {

    throw new Error(
      `Failed to deduct ${material.name}: ${deductionError.message}`
    );

  }

}


/* =========================
   4. INVENTORY HISTORY
========================== */

const inventoryTransactions =
  requiredMaterials.map((material) => ({

    material_name:
      material.name,

    quantity_used:
      material.amount,

    transaction_type:
      "AUTO_DEDUCTION",

    reference:
      `${selectedProduct} Production - ${batchNumber}`,

    created_at:
      new Date().toISOString(),

  }));

const {
  error: transactionError,
} = await supabase
  .from("inventory_transactions")
  .insert(
    inventoryTransactions
  );

if (transactionError) {

  throw new Error(
    `Inventory history failed: ${transactionError.message}`
  );

}

    /* =========================
       5. REFRESH DATA
    ========================== */

    await fetchData();

    /* =========================
       6. RESET FORM
    ========================== */

    setSelectedProduct("");
    setQuantityProduced("");
    setWasteQuantity("");
    setDoughBatches("");
    setShift("Morning");

    alert(
      "Production uploaded successfully! Inventory has been deducted."
    );

  } catch (error: any) {

    console.error(
      "Production upload error:",
      error
    );

    alert(
      error?.message ||
      "Failed to upload production."
    );

  } finally {

    setSaving(false);

  }
}

async function deleteProduction(log: any) {
  const confirmed = window.confirm(
    `DELETE PRODUCTION?\n\n` +
    `Product: ${log.bread}\n` +
    `Produced: ${Number(log.quantity || 0).toLocaleString()}\n` +
    `Waste: ${Number(log.waste_quantity || 0).toLocaleString()}\n` +
    `Dough Batches: ${Number(log.dough_batches || 0).toLocaleString()}\n\n` +
    `This will:\n` +
    `• Remove the production record\n` +
    `• Reverse finished product stock\n` +
    `• Restore ALL materials used\n` +
    `• Remove its inventory history\n\n` +
    `This action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    /* =========================
       BASIC VALUES
    ========================== */

    const batches = Number(log.dough_batches || 0);
    const produced = Number(log.quantity || 0);
    const waste = Number(log.waste_quantity || 0);

    const netProduction = produced - waste;

    if (batches <= 0) {
      throw new Error("Invalid dough batch value.");
    }

    if (produced <= 0) {
      throw new Error("Invalid production quantity.");
    }

    /* =========================
       FIND PRODUCT
    ========================== */

    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("*")
      .eq("id", log.product_id)
      .single();

    if (productError || !product) {
      throw new Error("Finished product not found.");
    }

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
      ].includes(log.bread)
    ) {
      recipeName = "Iruka Recipe";
    } else if (
      [
        "Small Rosy",
        "Medium Rosy",
        "Big Brother Family",
      ].includes(log.bread)
    ) {
      recipeName = "White Recipe";
    } else if (
      [
        "Classic Fruits",
        "Jumbo Fruits",
      ].includes(log.bread)
    ) {
      recipeName = "Fruits Recipe";
    }

    if (!recipeName) {
      throw new Error(
        `Recipe mapping not found for ${log.bread}.`
      );
    }

    /* =========================
       MATERIAL CALCULATIONS
       MUST EXACTLY MATCH SAVE
    ========================== */

    const flourUsed =
      batches * 2;

    const sugarUsed =
      (batches * 12) / 50;

    const butterUsed =
      (batches * 1.35) / 15;

    const yeastUsed =
      batches;

    const groundnutOilUsed =
      (batches * 0.23) / 23;

    const recipeUsed =
      batches;

    const brownUsed =
      [
        "Small Iruka",
        "Big Smart",
        "Medium Iruka",
        "Classic Iruka",
        "Jumbo Iruka",
      ].includes(log.bread)
        ? batches * 0.5
        : 0;

    const flavourUsed =
      batches * 0.25;

    const tapeUsed =
      [
        "Small Iruka",
        "Small Rosy",
      ].includes(log.bread)
        ? batches * 0.8181
        : 0;

    const twistUsed =
      [
        "Big Smart",
        "Medium Rosy",
        "Medium Iruka",
        "Jumbo Fruits",
        "Jumbo Iruka",
        "Classic Fruits",
        "Classic Iruka",
        "Big Brother Family",
      ].includes(log.bread)
        ? produced / 600
        : 0;

    const nylonUsed =
      produced;

      const nylonNameMap: Record<string, string> = {

  "Small Iruka":
    "Small Iruka Nylon",

  "Small Rosy":
    "Small Rosy Nylon",

  "Medium Iruka":
    "Medium Iruka Nylon",

  "Medium Rosy":
    "Medium Rosy Nylon",

  "Big Smart":
    "Big Smart Nylon",

  "Classic Iruka":
    "Classic Iruka Nylon",

  "Classic Fruits":
    "Classic Fruits Nylon",

  "Jumbo Iruka":
    "Jumbo Iruka Nylon",

  "Jumbo Fruits":
    "Jumbo Fruits Nylon",

  "Big Brother Family":
    "Big Brother Family Nylon",

};

const nylonName =
  nylonNameMap[log.bread];

if (!nylonName) {
  throw new Error(
    `Nylon mapping not found for ${log.bread}.`
  );
}

/* =========================
   RESINS

   1 KG PER DOUGH BATCH

   Products:
   Small Rosy
   Classic Fruits
   Jumbo Fruits
   Big Brother Family

   Inventory is stored in cartons.
   1 carton = 10kg.
========================== */

const resinUsedKg =
  [
    "Small Rosy",
    "Classic Fruits",
    "Jumbo Fruits",
    "Big Brother Family",
  ].includes(log.bread)
    ? batches
    : 0;

const resinUsedCartons =
  resinUsedKg / 10;

    /* =========================
       GET INVENTORY
    ========================== */

    const {
      data: inventory,
      error: inventoryError,
    } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      throw new Error(
        `Failed to load inventory: ${inventoryError.message}`
      );
    }

    /* =========================
       BUILD RESTORATION LIST
    ========================== */

    const materialsToRestore = [
      {
        name: "Flour",
        amount: flourUsed,
      },
      {
        name: "Sugar",
        amount: sugarUsed,
      },
      {
        name: "Butter",
        amount: butterUsed,
      },
      {
        name: "Yeast",
        amount: yeastUsed,
      },
      {
        name: "Groundnut Oil",
        amount: groundnutOilUsed,
      },
      {
        name: recipeName,
        amount: recipeUsed,
      },
      {
        name: "Flavour",
        amount: flavourUsed,
      },
  {
  name: nylonName,
  amount: nylonUsed,
},
    ];

    if (brownUsed > 0) {
      materialsToRestore.push({
        name: "Brown",
        amount: brownUsed,
      });
    }

    if (tapeUsed > 0) {
      materialsToRestore.push({
        name: "Tape",
        amount: tapeUsed,
      });
    }

    if (twistUsed > 0) {
      materialsToRestore.push({
        name: "Twist",
        amount: twistUsed,
      });
    }

if (resinUsedCartons > 0) {
  materialsToRestore.push({
    name: "Resins",
    amount: resinUsedCartons,
  });
}

    /* =========================
       VERIFY ALL INVENTORY ITEMS
       BEFORE CHANGING ANYTHING
    ========================== */

    for (const material of materialsToRestore) {
      const item = inventory?.find(
        (i) => i.name === material.name
      );

      if (!item) {
        throw new Error(
          `${material.name} inventory item not found.`
        );
      }
    }

    /* =========================
       CHECK FINISHED STOCK
    ========================== */

    const currentProductStock =
      Number(product.stock || 0);

    if (
      currentProductStock <
      netProduction
    ) {
      throw new Error(
        `Cannot delete this production.\n\n` +
        `Current ${log.bread} stock: ${currentProductStock.toLocaleString()}\n` +
        `Stock produced by this record: ${netProduction.toLocaleString()}\n\n` +
        `The finished product has already been used.`
      );
    }

    /* =========================
       RESTORE INVENTORY
    ========================== */

    for (const material of materialsToRestore) {
      const item = inventory?.find(
        (i) => i.name === material.name
      );

      if (!item) {
        throw new Error(
          `${material.name} inventory item not found.`
        );
      }

      const newQuantity =
        Number(item.quantity || 0) +
        material.amount;

      const {
        error,
      } = await supabase
        .from("inventory")
        .update({
          quantity: newQuantity,
        })
        .eq("id", item.id);

      if (error) {
        throw new Error(
          `Failed to restore ${material.name}: ${error.message}`
        );
      }
    }

    /* =========================
       REVERSE FINISHED PRODUCT
    ========================== */

    const newProductStock =
      currentProductStock -
      netProduction;

    const {
      error: stockError,
    } = await supabase
      .from("products")
      .update({
        stock: newProductStock,
      })
      .eq("id", product.id);

    if (stockError) {
      throw new Error(
        `Failed to reverse ${log.bread} stock: ${stockError.message}`
      );
    }

    /* =========================
       DELETE PRODUCTION LOG
    ========================== */

    const {
      error: deleteError,
    } = await supabase
      .from("production_logs")
      .delete()
      .eq("id", log.id);

    if (deleteError) {
      throw new Error(
        `Failed to delete production record: ${deleteError.message}`
      );
    }

    /* =========================
       DELETE ONLY THIS RECORD'S
       INVENTORY HISTORY
    ========================== */

    const {
      error: historyError,
    } = await supabase
      .from("inventory_transactions")
      .delete()
      .eq(
        "reference",
        `${log.bread} Production - ${log.batch}`
      );

    if (historyError) {
      console.error(
        "Inventory history cleanup error:",
        historyError
      );
    }

    /* =========================
       REFRESH EVERYTHING
    ========================== */

    await fetchData();

    /* =========================
       SUCCESS
    ========================== */

    alert(
      `Production deleted successfully.\n\n` +
      `${log.bread}: ${netProduction.toLocaleString()} pieces removed from finished stock.\n` +
      `All production materials have been restored.`
    );

  } catch (error: any) {

    console.error(
      "Delete production error:",
      error
    );

    alert(
      error?.message ||
      "Failed to delete production."
    );
  }
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
  quantityProduced={quantityProduced}
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

<th className="px-6 py-4 text-center text-slate-300">
  Status
</th>

<th className="px-6 py-4 text-center text-slate-300">
  Date
</th>

<th className="px-6 py-4 text-center text-slate-300">
  Action
</th>

        </tr>

      </thead>

      <tbody>

        {displayedHistory.length === 0 && (

          <tr>

            <td
              colSpan={9}
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

              <td className="px-6 py-5 text-center">

  <button
    onClick={() => deleteProduction(log)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition"
  >
    Delete
  </button>

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