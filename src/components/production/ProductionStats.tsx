interface ProductionStatsProps {
  totalProduced: number;
  totalWaste: number;
  netProduction: number;
  totalDoughBatches: number;
}

export default function ProductionStats({
  totalProduced,
  totalWaste,
  netProduction,
  totalDoughBatches,
}: ProductionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {/* Produced */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
          Today's Production
        </p>

        <h2 className="text-5xl font-black text-blue-950 mt-4">
          {totalProduced.toLocaleString()}
        </h2>

        <p className="text-gray-400 mt-2">
          Total Pieces Produced
        </p>

      </div>

      {/* Waste */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
          Waste
        </p>

        <h2 className="text-5xl font-black text-red-600 mt-4">
          {totalWaste.toLocaleString()}
        </h2>

        <p className="text-gray-400 mt-2">
          Damaged Pieces
        </p>

      </div>

      {/* Net */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
          Net Production
        </p>

        <h2 className="text-5xl font-black text-green-600 mt-4">
          {netProduction.toLocaleString()}
        </h2>

        <p className="text-gray-400 mt-2">
          Available Stock Added
        </p>

      </div>

      {/* Dough */}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
          Dough Batches
        </p>

        <h2 className="text-5xl font-black text-orange-500 mt-4">
          {totalDoughBatches}
        </h2>

        <p className="text-gray-400 mt-2">
          Mixed Today
        </p>

      </div>

    </div>
  );
}