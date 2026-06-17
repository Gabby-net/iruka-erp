"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function ProductionPage() {

  /* =========================
     STATES
  ========================== */

  const [products, setProducts] =
    useState<any[]>([]);

  const [productionLogs, setProductionLogs] =
    useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [shift, setShift] =
    useState("Morning");

  const [quantityProduced, setQuantityProduced] =
    useState("");

  const [wasteQuantity, setWasteQuantity] =
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

    /* PRODUCTION LOGS */

    const {
      data: productionData,
    } = await supabase

      .from("production_logs")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    setProducts(productsData || []);

    setProductionLogs(
      productionData || []
    );
  }

  /* =========================
     SAVE PRODUCTION
  ========================== */

  async function saveProduction() {

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

const selectedProductData = products.find(
  (p) => p.name === selectedProduct
);

await supabase
  .from("production_logs")
  .insert([
    {
      product_id: selectedProductData?.id || null,
      bread: selectedProduct,
      quantity: Number(quantityProduced),
      waste_quantity: Number(wasteQuantity || 0),
      produced_by: "Production Staff",
      batch: "IRK-" + Date.now(),
      shift,
      team: "A",
      status: "Completed",
      production_date:
        new Date()
          .toISOString()
          .split("T")[0],
    },
  ]);

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

    /* =========================
       PRODUCT OUTPUT RATIOS
    ========================== */

    const recipeOutputs: any = {

      "Small Iruka": 700,

      "Small Rosy": 600,

      "Medium Iruka": 230,

      "Medium Rosy": 230,

      "Big Smart": 300,

      "Classic Iruka": 160,

      "Classic Fruits": 160,

      "Jumbo Iruka": 125,

      "Jumbo Fruits": 125,

      "Big Brother Family": 96,
    };

    const standardOutput =
      recipeOutputs[
        selectedProduct
      ];

    if (!standardOutput) {

      alert(
        "Recipe output not found for this product"
      );

      return;
    }

    /* =========================
       CALCULATE RATIO
    ========================== */

    const productionRatio =
      Number(
        quantityProduced
      ) / standardOutput;

    /* =========================
       MATERIAL USAGE
    ========================== */

    const flourUsed =
      2 * productionRatio;

    const sugarUsed =
      12 * productionRatio;

    const butterUsed =
      1 * productionRatio;

    const yeastUsed =
      0.5 * productionRatio;

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

  const totalProduced =
    productionLogs.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ),
      0
    );

  const totalWaste =
    productionLogs.reduce(
      (sum, item) =>
        sum +
        Number(
          item.waste_quantity || 0
        ),
      0
    );

  const netProduction =
    totalProduced -
    totalWaste;

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "production",
      ]}
    >

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            Daily Production Center

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Smart bakery production & inventory automation

          </p>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* PRODUCED */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Total Produced

            </h2>

            <p className="text-5xl font-black text-blue-950 mt-4">

              {totalProduced}

            </p>

          </div>

          {/* WASTE */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Total Waste

            </h2>

            <p className="text-5xl font-black text-red-600 mt-4">

              {totalWaste}

            </p>

          </div>

          {/* NET */}

          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-xl font-bold text-gray-500">

              Net Production

            </h2>

            <p className="text-5xl font-black text-green-700 mt-4">

              {netProduction}

            </p>

          </div>

        </div>

        {/* RECORD PRODUCTION */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Upload Daily Production

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

            {/* SHIFT */}

            <select
              value={shift}

              onChange={(e) =>
                setShift(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            >

              <option value="Morning">

                Morning Shift

              </option>

              <option value="Night">

                Night Shift

              </option>

            </select>

            {/* QUANTITY */}

            <input
              type="number"

              placeholder="Quantity Produced"

              value={quantityProduced}

              onChange={(e) =>
                setQuantityProduced(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            {/* WASTE */}

            <input
              type="number"

              placeholder="Waste Quantity"

              value={wasteQuantity}

              onChange={(e) =>
                setWasteQuantity(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

          </div>

          <button
            onClick={saveProduction}

            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold"
          >

            Upload Production

          </button>

        </div>

        {/* HISTORY */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Production History

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Product

                  </th>

                  <th className="p-4 text-left">

                    Shift

                  </th>

                  <th className="p-4 text-left">

                    Produced

                  </th>

                  <th className="p-4 text-left">

                    Waste

                  </th>

                  <th className="p-4 text-left">

                    Net

                  </th>

                  <th className="p-4 text-left">

                    Date

                  </th>

                </tr>

              </thead>

              <tbody>

                {productionLogs.map(
                  (log) => {

                    const net =
  Number(
    log.quantity || 0
  ) -
  Number(
    log.waste_quantity || 0
  );

                    return (

                      <tr
                        key={log.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-4 font-semibold">

                          {
                            log.product_name
                          }

                        </td>

                        <td className="p-4">

                          {log.shift}

                        </td>

                        <td className="p-4 text-blue-950 font-bold">

                          {
                            log.quantity_produced
                          }

                        </td>

                        <td className="p-4 text-red-600 font-bold">

                          {
                            log.waste_quantity
                          }

                        </td>

                        <td className="p-4 text-green-700 font-black">

                          {net}

                        </td>

                        <td className="p-4">

                          {new Date(
                            log.created_at
                          ).toLocaleString()}

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