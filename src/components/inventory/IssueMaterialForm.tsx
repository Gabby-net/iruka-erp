interface IssueMaterialFormProps {
  material: string;
  setMaterial: (value: string) => void;

  quantity: string;
  setQuantity: (value: string) => void;

  issueMaterial: () => void;
}

export default function IssueMaterialForm({
  material,
  setMaterial,
  quantity,
  setQuantity,
  issueMaterial,
}: IssueMaterialFormProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden mb-10">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-8 py-6">

        <h2 className="text-3xl font-black text-white">
          📤 Issue Materials
        </h2>

        <p className="text-red-100 mt-2">
          Manually issue inventory materials to production.
        </p>

      </div>

      {/* BODY */}

      <div className="p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* MATERIAL */}

          <div>

            <label className="block text-slate-300 font-semibold mb-2">

              Material

            </label>

            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400 transition"
            >

              <option value="">
                Select Material
              </option>

              <optgroup label="🍞 Production Ingredients">

                <option value="Flour">
                  Flour
                </option>

                <option value="Sugar">
                  Sugar
                </option>

                <option value="Butter">
                  Butter
                </option>

                <option value="Yeast">
                  Yeast
                </option>

                <option value="Groundnut Oil">
                  Groundnut Oil
                </option>

              </optgroup>

              <optgroup label="🥖 Bakery Recipes">

                <option value="Iruka Recipe">
                  Iruka Recipe
                </option>

                <option value="White Recipe">
                  White Recipe
                </option>

                <option value="Fruits Recipe">
                  Fruits Recipe
                </option>

              </optgroup>

              <optgroup label="📦 Packaging Materials">

                <option value="Tape">
                  Tape
                </option>

                <option value="Twist">
                  Twist
                </option>

              </optgroup>

              <optgroup label="🧪 Bakery Additives">

                <option value="Brown">
                  Brown
                </option>

                <option value="Resins">
                  Resins
                </option>

                <option value="Flavour">
                  Flavour
                </option>

              </optgroup>

            </select>

          </div>

          {/* QUANTITY */}

          <div>

            <label className="block text-slate-300 font-semibold mb-2">

              Quantity

            </label>

            <input
              type="number"
              placeholder="Enter Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />

          </div>

        </div>

        {/* INFO */}

        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">

          <p className="text-amber-300 font-semibold">

            ⚠ Issued materials are immediately deducted from inventory and recorded in Inventory History.

          </p>

        </div>

        {/* BUTTON */}

        <button
          onClick={issueMaterial}
          className="mt-8 w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-lg font-black rounded-2xl py-4 transition-all duration-300 shadow-xl"
        >

          📤 Issue Material

        </button>

      </div>

    </div>
  );
}