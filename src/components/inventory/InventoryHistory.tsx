interface InventoryHistoryProps {
  transactions: any[];
}

export default function InventoryHistory({
  transactions,
}: InventoryHistoryProps) {
  return (
    <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-8 mt-10">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-black text-white">
            Inventory History
          </h2>

          <p className="text-slate-400 mt-2">
            Complete inventory movement history
          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-[#071028] text-white">

              <th className="p-4 text-left">
                Material
              </th>

              <th className="p-4 text-center">
                Type
              </th>

              <th className="p-4 text-center">
                Quantity
              </th>

              <th className="p-4 text-center">
                Reference
              </th>

              <th className="p-4 text-right">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {transactions.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-700 hover:bg-slate-800"
              >

<td className="p-4 font-bold text-white">
  {item.material_name}
</td>

<td className="p-4 text-center">

  {item.transaction_type === "RECEIVED" ? (

    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold text-sm">
      Received
    </span>

  ) : item.transaction_type === "ISSUED" ? (

    <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full font-bold text-sm">
      Issued
    </span>

  ) : (

    <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold text-sm">
      Auto Deduction
    </span>

  )}

</td>

<td className="p-4 text-center text-amber-300 font-black">
  {item.quantity_used}
</td>

<td className="p-4 text-center text-slate-300">
  {item.reference}
</td>

<td className="p-4 text-right text-slate-400">
  {new Date(item.created_at).toLocaleString()}
</td>


              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}