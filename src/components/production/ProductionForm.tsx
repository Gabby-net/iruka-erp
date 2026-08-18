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

        <select
          value={selectedProduct}
          onChange={(e) =>
            setSelectedProduct(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4"
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

        <input
          type="number"
          placeholder="Pieces Produced"
          value={quantityProduced}
          onChange={(e) =>
            setQuantityProduced(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4"
        />

        <input
          type="number"
          placeholder="Waste Pieces"
          value={wasteQuantity}
          onChange={(e) =>
            setWasteQuantity(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4"
        />

        <input
          type="number"
          placeholder="Dough Batches"
          value={doughBatches}
          onChange={(e) =>
            setDoughBatches(e.target.value)
          }
          className="w-full rounded-2xl border-2 border-slate-200 p-4"
        />

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() => setShift("Morning")}
            className={`rounded-2xl py-4 font-bold transition ${
              shift === "Morning"
                ? "bg-blue-950 text-white"
                : "bg-slate-100"
            }`}
          >
            🌞 Morning
          </button>

          <button
            onClick={() => setShift("Night")}
            className={`rounded-2xl py-4 font-bold transition ${
              shift === "Night"
                ? "bg-blue-950 text-white"
                : "bg-slate-100"
            }`}
          >
            🌙 Night
          </button>

        </div>

        <button
          onClick={saveProduction}
          className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-2xl py-5 text-lg font-black transition"
        >
          {saving ? "Uploading..." : "Upload Production"}
        </button>

      </div>

    </div>
  );
}