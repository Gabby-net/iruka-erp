interface ProductionDetailsProps {
  open: boolean;
  production: any;
  onClose: () => void;
}

export default function ProductionDetails({
  open,
  production,
  onClose,
}: ProductionDetailsProps) {

  if (!open || !production) return null;

  const net =
    Number(production.quantity || 0) -
    Number(production.waste_quantity || 0);

  return (

    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">

      <div className="bg-white w-full max-w-xl h-screen overflow-y-auto shadow-2xl p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-3xl font-black text-[#071028]">

              Production Details

            </h2>

            <p className="text-gray-500 mt-2">

              Batch {production.batch}

            </p>

          </div>

          <button
            onClick={onClose}
            className="text-3xl font-bold"
          >
            ×
          </button>

        </div>

        <div className="space-y-6">

          <DetailRow
            title="Product"
            value={production.bread}
          />

          <DetailRow
            title="Shift"
            value={production.shift}
          />

          <DetailRow
            title="Pieces Produced"
            value={production.quantity}
          />

          <DetailRow
            title="Waste"
            value={production.waste_quantity}
          />

          <DetailRow
            title="Net Production"
            value={net}
          />

          <DetailRow
            title="Dough Batches"
            value={production.dough_batches}
          />

          <DetailRow
            title="Status"
            value={production.status}
          />

          <DetailRow
            title="Date"
            value={new Date(
              production.created_at
            ).toLocaleString()}
          />

        </div>

      </div>

    </div>

  );

}

function DetailRow({
  title,
  value,
}: {
  title: string;
  value: any;
}) {

  return (

    <div className="flex justify-between items-center border-b border-slate-200 pb-4">

      <span className="text-gray-500">

        {title}

      </span>

      <span className="font-bold text-[#071028]">

        {value}

      </span>

    </div>

  );

}