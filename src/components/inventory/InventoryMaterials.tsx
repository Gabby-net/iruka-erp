interface InventoryMaterialsProps {
  inventory: any[];
  isLowStock: (item: any) => boolean;
}

export default function InventoryMaterials({
  inventory,
  isLowStock,
}: InventoryMaterialsProps) {

  /* =========================
     PRODUCTION INGREDIENTS
  ========================== */

  const production = inventory.filter((item) =>
    [
      "Flour",
      "Sugar",
      "Butter",
      "Yeast",
      "Groundnut Oil",
      "Iruka Recipe",
      "White Recipe",
      "Fruits Recipe",
    ].includes(item.name)
  );

  /* =========================
     PACKAGING MATERIALS
  ========================== */

  const packaging = inventory.filter((item) =>
    [
      "Tape",
      "Twist",

      // PRODUCT NYLONS
      "Small Iruka Nylon",
      "Small Rosy Nylon",
      "Medium Iruka Nylon",
      "Medium Rosy Nylon",
      "Big Smart Nylon",
      "Classic Iruka Nylon",
      "Classic Fruits Nylon",
      "Jumbo Iruka Nylon",
      "Jumbo Fruits Nylon",
      "Big Brother Family Nylon",
    ].includes(item.name)
  );

  /* =========================
     BAKERY ADDITIVES
  ========================== */

  const additives = inventory.filter((item) =>
    [
      "Brown",
      "Resins",
      "Flavour",
    ].includes(item.name)
  );

  /* =========================
     SECTION COMPONENT
  ========================== */

  function Section(
    title: string,
    icon: string,
    items: any[]
  ) {
    return (
      <div className="mb-10">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-xl shadow-lg">
            {icon}
          </div>

          <h2 className="text-2xl font-black text-white">
            {title}
          </h2>

        </div>

        {items.length === 0 ? (

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-center text-slate-400">
            No materials available.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {items.map((item) => (

              <div
                key={item.id}
                className="group rounded-3xl bg-slate-800 border border-slate-700 hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 shadow-xl overflow-hidden"
              >

                <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />

                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-xl font-black text-white">
                        {item.name}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
                        {item.unit || "Unit not set"}
                      </p>

                    </div>

                    {isLowStock(item) ? (

                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                        LOW
                      </span>

                    ) : (

                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                        HEALTHY
                      </span>

                    )}

                  </div>

                  <div className="mt-8">

                    <p className="text-5xl font-black text-amber-300">
                      {Number(item.quantity || 0).toLocaleString()}
                    </p>

                  </div>

                  <div className="mt-6">

                    <div className="flex justify-between text-xs text-slate-400 mb-2">

                      <span>
                        Inventory Level
                      </span>

                      <span>
                        {isLowStock(item)
                          ? "Needs Restock"
                          : "Healthy"}
                      </span>

                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLowStock(item)
                            ? "bg-red-500 w-1/4"
                            : "bg-gradient-to-r from-green-400 to-emerald-500 w-full"
                        }`}
                      />

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    );
  }

  /* =========================
     DISPLAY
  ========================== */

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8">

      {/* PRODUCTION */}

      {Section(
        "Production Ingredients",
        "🍞",
        production
      )}

      {/* PACKAGING */}

      {Section(
        "Packaging Materials",
        "📦",
        packaging
      )}

      {/* ADDITIVES */}

      {Section(
        "Bakery Additives",
        "🧪",
        additives
      )}

    </div>

  );
}