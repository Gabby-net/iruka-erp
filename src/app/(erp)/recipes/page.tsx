"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function RecipesPage() {

  const [recipes, setRecipes] =
    useState<any[]>([]);

  const [productName, setProductName] =
    useState("");

  const [batchOutput, setBatchOutput] =
    useState(0);

  const [flourBags, setFlourBags] =
    useState(0);

  const [sugarKg, setSugarKg] =
    useState(0);

  const [margarineKg, setMargarineKg] =
    useState(0);

  const [yeastG, setYeastG] =
    useState(0);

  const [saltKg, setSaltKg] =
    useState(0);

  const [nylonPacks, setNylonPacks] =
    useState(0);

  useEffect(() => {

    fetchRecipes();

  }, []);

  /* FETCH RECIPES */

  async function fetchRecipes() {

    const { data } =
      await supabase

        .from("production_recipes")

        .select("*")

        .order("created_at", {
          ascending: false,
        });

    setRecipes(data || []);
  }

  /* SAVE RECIPE */

  async function saveRecipe() {

    if (
      !productName ||
      batchOutput <= 0
    ) {

      alert(
        "Fill all required fields"
      );

      return;
    }

    const { error } =
      await supabase

        .from("production_recipes")

        .insert([

          {
            product_name:
              productName,

            batch_output:
              batchOutput,

            flour_bags:
              flourBags,

            sugar_kg:
              sugarKg,

            margarine_kg:
              margarineKg,

            yeast_g:
              yeastG,

            salt_kg:
              saltKg,

            nylon_packs:
              nylonPacks,
          },
        ]);

    if (error) {

      console.error(error);

      alert(
        "Failed to save recipe"
      );

      return;
    }

    /* RESET */

    setProductName("");

    setBatchOutput(0);

    setFlourBags(0);

    setSugarKg(0);

    setMargarineKg(0);

    setYeastG(0);

    setSaltKg(0);

    setNylonPacks(0);

    fetchRecipes();
  }

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
      ]}
    >

      <div className="p-8 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-black text-blue-950">

            Production Recipes

          </h1>

          <p className="text-gray-500 mt-2">

            Manage bakery production formulas

          </p>

        </div>

        {/* FORM */}

        <div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

          <h2 className="text-2xl font-bold mb-6">

            Add Production Recipe

          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) =>
              setProductName(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Batch Output"
            value={batchOutput}
            onChange={(e) =>
              setBatchOutput(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Flour Bags"
            value={flourBags}
            onChange={(e) =>
              setFlourBags(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Sugar (kg)"
            value={sugarKg}
            onChange={(e) =>
              setSugarKg(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Margarine (kg)"
            value={margarineKg}
            onChange={(e) =>
              setMargarineKg(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Yeast (g)"
            value={yeastG}
            onChange={(e) =>
              setYeastG(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Salt (kg)"
            value={saltKg}
            onChange={(e) =>
              setSaltKg(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="number"
            placeholder="Nylon Packs"
            value={nylonPacks}
            onChange={(e) =>
              setNylonPacks(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full border p-4 rounded-2xl mb-6"
          />

          <button
            onClick={saveRecipe}
            className="bg-blue-950 text-white px-8 py-4 rounded-2xl font-bold"
          >

            Save Recipe

          </button>

        </div>

        {/* RECIPES TABLE */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">

              Production Recipes

            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Product
                </th>

                <th className="p-4 text-left">
                  Output
                </th>

                <th className="p-4 text-left">
                  Flour
                </th>

                <th className="p-4 text-left">
                  Sugar
                </th>

                <th className="p-4 text-left">
                  Margarine
                </th>

                <th className="p-4 text-left">
                  Yeast
                </th>

              </tr>

            </thead>

            <tbody>

              {recipes.map((recipe) => (

                <tr
                  key={recipe.id}
                  className="border-b"
                >

                  <td className="p-4 font-bold">

                    {recipe.product_name}

                  </td>

                  <td className="p-4">

                    {recipe.batch_output}

                  </td>

                  <td className="p-4">

                    {recipe.flour_bags} bags

                  </td>

                  <td className="p-4">

                    {recipe.sugar_kg} kg

                  </td>

                  <td className="p-4">

                    {recipe.margarine_kg} kg

                  </td>

                  <td className="p-4">

                    {recipe.yeast_g} g

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </ProtectedRoute>
  );
}