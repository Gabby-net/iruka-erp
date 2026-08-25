interface RecipePreviewProps {
  doughBatches: string;
  quantityProduced: string;
  selectedProduct: string;
  recipeName: string;
}

export default function RecipePreview({
  doughBatches,
  quantityProduced,
  selectedProduct,
  recipeName,
}: RecipePreviewProps) {

  const batches = Number(doughBatches || 0);

  /* =========================
     BASIC MATERIALS
  ========================== */

  const flour = batches * 2;

  const sugar = batches * 12;

  const butter = batches * 1.35;

  const yeast = batches * 0.5;

  const oil = batches * 0.23;


  /* =========================
     RECIPE
  ========================== */

  const recipe = batches;


  /* =========================
     FLAVOUR
     0.25 KG PER BATCH
  ========================== */

  const flavour = batches * 0.25;


  /* =========================
     BROWN
     0.5 L PER BATCH

     ONLY:
     Small Iruka
     Big Smart
     Medium Iruka
     Classic Iruka
     Jumbo Iruka
  ========================== */

  const brown =
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
     TAPE
     0.8181 PER BATCH

     ONLY:
     Small Iruka
     Small Rosy
  ========================== */

  const tape =
    [
      "Small Iruka",
      "Small Rosy",
    ].includes(selectedProduct)
      ? batches * 0.8181
      : 0;


  /* =========================
     RESINS
     1 KG PER BATCH

     ONLY:
     Big Brother Family
     Small Rosy
     Jumbo Fruits
  ========================== */

  const resins =
    [
      "Big Brother Family",
      "Small Rosy",
      "Jumbo Fruits",
    ].includes(selectedProduct)
      ? batches
      : 0;


  /* =========================
     NYLON

     IMPORTANT:
     Nylon is calculated from
     PRODUCED PIECES, not dough
     batches.

     The production form does
     not currently pass quantityProduced
     into this component.

     Therefore we cannot accurately
     display the exact nylon quantity
     here yet.
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
    nylonNameMap[selectedProduct] || "";


  return (

    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

      {/* =========================
          HEADER
      ========================== */}

      <div className="flex justify-between items-start gap-4">

        <div>

          <h2 className="text-3xl font-black text-[#071028]">
            Live Recipe Preview
          </h2>

          <p className="text-gray-500 mt-2">
            Inventory that will be consumed
          </p>

        </div>

        <div className="flex flex-col items-end gap-2">

          <div className="bg-green-100 text-green-700 rounded-2xl px-4 py-2 font-bold">

            {recipeName
              ? `${recipeName} RECIPE`
              : "No Recipe"}

          </div>

          <span className="text-sm text-gray-500">

            {selectedProduct || "No Product"}

          </span>

        </div>

      </div>


      {/* =========================
          MATERIALS
      ========================== */}

      <div className="mt-8 space-y-4">

        <RecipeRow
          title="Flour"
          value={`${flour.toLocaleString()} Bags`}
        />

        <RecipeRow
          title="Sugar"
          value={`${sugar.toLocaleString()} kg`}
        />

        <RecipeRow
          title="Butter"
          value={`${butter.toFixed(2)} kg`}
        />

        <RecipeRow
          title="Yeast"
          value={`${yeast.toFixed(2)} kg`}
        />

        <RecipeRow
          title="Groundnut Oil"
          value={`${oil.toFixed(2)} kg`}
        />

        <RecipeRow
          title={recipeName || "Recipe"}
          value={`${recipe.toLocaleString()} Packs`}
        />

        <RecipeRow
          title="Flavour"
          value={`${flavour.toFixed(2)} kg`}
        />


        {/* =========================
            PRODUCT NYLON
        ========================== */}

        {nylonName && (

          <RecipeRow
            title={nylonName}
            value="Based on pieces produced"
          />

        )}


        {/* =========================
            CONDITIONAL MATERIALS
        ========================== */}

        {brown > 0 && (

          <RecipeRow
            title="Brown"
            value={`${brown.toFixed(2)} L`}
          />

        )}

        {tape > 0 && (

          <RecipeRow
            title="Tape"
            value={`${tape.toFixed(2)} Packs`}
          />

        )}

        {resins > 0 && (

          <RecipeRow
            title="Resins"
            value={`${resins.toFixed(2)} kg`}
          />

        )}

      </div>


      {/* =========================
          TWIST
      ========================== */}

      {[
        "Big Smart",
        "Medium Rosy",
        "Medium Iruka",
        "Jumbo Fruits",
        "Jumbo Iruka",
        "Classic Fruits",
        "Classic Iruka",
        "Big Brother Family",
      ].includes(selectedProduct) && (

        <div className="mt-4">

          <RecipeRow
            title="Twist"
            value="Based on pieces produced"
          />

        </div>

      )}


      {/* =========================
          BATCH SUMMARY
      ========================== */}

      <div className="mt-10 bg-blue-50 rounded-2xl p-5">

        <p className="text-blue-900 font-bold text-lg">

          {batches} Dough Batch
          {batches !== 1 ? "es" : ""}

        </p>

        <p className="text-gray-600 mt-2">

          The materials above will be deducted automatically
          when production is uploaded.

        </p>

      </div>


      {/* =========================
          IMPORTANT NOTICE
      ========================== */}

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">

        <p className="text-amber-800 text-sm font-semibold">

          ⚠ Nylon and Twist quantities are calculated from
          the actual number of bread pieces produced,
          not dough batches.

        </p>

      </div>

    </div>

  );
}


/* =========================
   RECIPE ROW
========================== */

function RecipeRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div className="flex justify-between items-center border-b border-slate-100 pb-3 gap-4">

      <span className="font-semibold text-gray-700">

        {title}

      </span>

      <span className="text-lg font-black text-red-600 text-right">

        {value}

      </span>

    </div>

  );

}