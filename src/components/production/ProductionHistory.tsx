interface ProductionHistoryProps {
  productionLogs: any[];
}

export default function ProductionHistory({
  productionLogs,
}: ProductionHistoryProps) {

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

        <div>

          <h2 className="text-3xl font-black text-[#071028]">
            Production History
          </h2>

          <p className="text-gray-500 mt-2">
            Daily production records and completed batches
          </p>

        </div>

        <div className="flex gap-3 flex-wrap">

          <input
            type="text"
            placeholder="🔍 Search product..."
            className="border-2 border-slate-200 rounded-2xl px-5 py-3 w-72 focus:outline-none focus:border-[#071028]"
          />

          <select className="border-2 border-slate-200 rounded-2xl px-4 py-3">

            <option>All Shifts</option>
            <option>Morning</option>
            <option>Night</option>

          </select>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-slate-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Production Records
          </p>

          <h2 className="text-4xl font-black text-[#071028] mt-2">
            {productionLogs.length}
          </h2>

        </div>

        <div className="bg-slate-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Pieces Produced
          </p>

          <h2 className="text-4xl font-black text-green-600 mt-2">

            {productionLogs
              .reduce(
                (sum, item) =>
                  sum + Number(item.quantity || 0),
                0
              )
              .toLocaleString()}

          </h2>

        </div>

        <div className="bg-slate-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Dough Batches
          </p>

          <h2 className="text-4xl font-black text-orange-500 mt-2">

            {productionLogs.reduce(
              (sum, item) =>
                sum + Number(item.dough_batches || 0),
              0
            )}

          </h2>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto rounded-3xl border border-slate-200">

        <table className="w-full">

          <thead>

            <tr className="bg-[#071028] text-white">

              <th className="p-5 text-left rounded-l-2xl">
                Product
              </th>

              <th className="p-5 text-center">
                Shift
              </th>

              <th className="p-5 text-center">
                Produced
              </th>

              <th className="p-5 text-center">
                Waste
              </th>

              <th className="p-5 text-center">
                Dough
              </th>

              <th className="p-5 text-center">
                Net
              </th>

              <th className="p-5 text-center">
                Status
              </th>

              <th className="p-5 text-right rounded-r-2xl">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {productionLogs.map((log) => {

              const net =
                Number(log.quantity || 0) -
                Number(log.waste_quantity || 0);

              return (

                <tr
                  key={log.id}
                  className="border-b hover:bg-slate-50 transition-all duration-200"
                >

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-xl">

                        🍞

                      </div>

                      <div>

                        <p className="font-bold text-[#071028]">
                          {log.bread}
                        </p>

                        <p className="text-sm text-gray-500">
                          Batch #{log.batch}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="text-center">

                    <span className="inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">

                      {log.shift}

                    </span>

                  </td>

                  <td className="text-center font-black text-blue-950 text-lg">

                    {Number(log.quantity).toLocaleString()}

                  </td>

                  <td className="text-center font-black text-red-600">

                    {Number(log.waste_quantity).toLocaleString()}

                  </td>

                  <td className="text-center font-black text-orange-500">

                    {log.dough_batches ?? "-"}

                  </td>

                  <td className="text-center font-black text-green-600 text-lg">

                    {net.toLocaleString()}

                  </td>

                  <td className="text-center">

                    <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold">

                      ✅ Completed

                    </span>

                  </td>

                  <td className="text-right text-gray-500">

                    {new Date(
                      log.created_at
                    ).toLocaleString()}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}