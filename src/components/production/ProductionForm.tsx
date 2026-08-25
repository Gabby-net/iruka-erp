interface ProductionFormProps {
  products: any[];

  selectedProduct: string;
  setSelectedProduct: (value: string) => void;

  quantityProduced: string;
  setQuantityProduced: (value: string) => void;

  wasteQuantity: string;
  setWasteQuantity: (value: string) => void;

  doughBatches: string;
  setDoughBatches: (value: string) => void;

  shift: string;
  setShift: (value: string) => void;

  saveProduction: () => void;
  saving: boolean;
}

export default function ProductionForm({
  products,
  selectedProduct,
  setSelectedProduct,
  quantityProduced,
  setQuantityProduced,
  wasteQuantity,
  setWasteQuantity,
  doughBatches,
  setDoughBatches,
  shift,
  setShift,
  saveProduction,
  saving,
}: ProductionFormProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

      <h2 className="text-3xl font-black text-[#071028]">
        Record Production
      </h2>

      <p className="text-gray-500 mt-2">
        Record today's bakery production.
      </p>

      <div className="mt-8 space-y-6">

        {/* PRODUCT */}

        <select
          value={selectedProduct}
          disabled={saving}
          onChange={(e) =>
            setSelectedProduct(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4 disabled:bg-slate-100"
        >
          <option value="">
            Select Product
          </option>

          {products.map((product) => (
            <option
              key={product.id}
              value={product.name}
            >
              {product.name}
            </option>
          ))}
        </select>

        {/* PRODUCED */}

        <input
          type="number"
          min="0"
          placeholder="Pieces Produced"
          value={quantityProduced}
          disabled={saving}
          onChange={(e) =>
            setQuantityProduced(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4 disabled:bg-slate-100"
        />

        {/* WASTE */}

        <input
          type="number"
          min="0"
          placeholder="Waste Pieces"
          value={wasteQuantity}
          disabled={saving}
          onChange={(e) =>
            setWasteQuantity(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4 disabled:bg-slate-100"
        />

        {/* DOUGH */}

        <input
          type="number"
          min="0"
          placeholder="Dough Batches"
          value={doughBatches}
          disabled={saving}
          onChange={(e) =>
            setDoughBatches(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4 disabled:bg-slate-100"
        />

        {/* SHIFT */}

        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              setShift("Morning")
            }
            className={`rounded-2xl py-4 font-bold transition ${
              shift === "Morning"
                ? "bg-blue-950 text-white"
                : "bg-slate-100 text-slate-700"
            } ${
              saving
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            🌞 Morning
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              setShift("Night")
            }
            className={`rounded-2xl py-4 font-bold transition ${
              shift === "Night"
                ? "bg-blue-950 text-white"
                : "bg-slate-100 text-slate-700"
            } ${
              saving
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            🌙 Night
          </button>

        </div>

        {/* UPLOAD */}

<button
  type="button"
  disabled={saving}
  onClick={() => {
    if (saving) return;
    saveProduction();
  }}
  className={`w-full rounded-2xl py-5 text-lg font-black transition ${
    saving
      ? "bg-slate-500 text-white cursor-not-allowed"
      : "bg-blue-950 hover:bg-blue-900 text-white"
  }`}
>
  {saving ? "Uploading..." : "Upload Production"}
</button>

      </div>

    </div>
  );
}