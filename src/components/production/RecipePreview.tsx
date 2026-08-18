interface RecipePreviewProps {
  doughBatches: string;
  selectedProduct: string;
  recipeName: string;
}

export default function RecipePreview({
  doughBatches,
  selectedProduct,
  recipeName,
}: RecipePreviewProps) {

  const batches = Number(doughBatches || 0);

  const flour = batches * 2;
  const sugar = batches * 12;
  const butter = batches * 1;
  const yeast = batches * 0.5;
  const oil = batches * 0.23;
  const nylon = batches * 1;

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

      <div className="flex justify-between items-center">

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

            {recipeName ? `${recipeName} RECIPE` : "No Recipe"}

          </div>

          <span className="text-sm text-gray-500">

            {selectedProduct || "No Product"}

          </span>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <RecipeRow
          title="Flour"
          value={`${flour} Bags`}
        />

        <RecipeRow
          title="Sugar"
          value={`${sugar} kg`}
        />

        <RecipeRow
          title="Butter"
          value={`${butter} kg`}
        />

        <RecipeRow
          title="Yeast"
          value={`${yeast} kg`}
        />

        <RecipeRow
          title="Groundnut Oil"
          value={`${oil.toFixed(2)} kg`}
        />

      </div>

      <div className="mt-10 bg-blue-50 rounded-2xl p-5">

        <p className="text-blue-900 font-bold">

          {batches} Dough Batch{batches !== 1 ? "es" : ""}

        </p>

        <p className="text-gray-600 mt-2">

          The inventory above will be deducted automatically after production is uploaded.

        </p>

      </div>

    </div>

  );
}

function RecipeRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div className="flex justify-between items-center border-b border-slate-100 pb-3">

      <span className="font-semibold text-gray-700">
        {title}
      </span>

      <span className="text-xl font-black text-red-600">
        {value}
      </span>

    </div>

  );
}