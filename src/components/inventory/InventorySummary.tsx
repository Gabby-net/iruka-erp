interface InventorySummaryProps {
  totalMaterials: number;
  lowStockCount: number;
}

export default function InventorySummary({
  totalMaterials,
  lowStockCount,
}: InventorySummaryProps) {

  const cards = [
    {
      title: "Total Materials",
      value: totalMaterials,
      icon: "📦",
      color: "from-blue-600 to-blue-500",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: "⚠️",
      color: "from-red-600 to-red-500",
    },
    {
      title: "Healthy Stock",
      value: totalMaterials - lowStockCount,
      icon: "✅",
      color: "from-green-600 to-green-500",
    },
    {
      title: "Warehouse",
      value: "Active",
      icon: "🏭",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

      {cards.map((card) => (

        <div
          key={card.title}
          className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >

          <div className={`h-2 bg-gradient-to-r ${card.color}`} />

          <div className="p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400 font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-black text-white mt-3">
                  {card.value}
                </h2>

              </div>

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl shadow-lg`}>
                {card.icon}
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  );
}