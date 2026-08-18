interface CustomerTableProps {
  customers: any[];
  orders: any[];
}

export default function CustomerTable({
  customers,
  orders,
}: CustomerTableProps) {

  return (

    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">

        <div>

          <h2 className="text-3xl font-black text-[#071028]">
            Customer Directory
          </h2>

          <p className="text-gray-500 mt-2">
            All registered customers from the mobile application.
          </p>

        </div>

        <input
          type="text"
          placeholder="Search customer..."
          className="border-2 border-slate-200 rounded-2xl px-5 py-3 w-80"
        />

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="bg-[#071028] text-white">

              <th className="p-5 text-left rounded-l-2xl">
                Customer
              </th>

              <th className="p-5 text-center">
                Phone
              </th>

              <th className="p-5 text-center">
                Orders
              </th>

              <th className="p-5 text-center">
                Lifetime Spend
              </th>

              <th className="p-5 text-center">
                Status
              </th>

              <th className="p-5 text-right rounded-r-2xl">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-yellow-500 text-black font-black flex items-center justify-center">

                      {customer.name
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}

                    </div>

                    <div>

                      <p className="font-bold text-[#071028]">

                        {customer.name}

                      </p>

                      <p className="text-sm text-gray-500">

                        Customer

                      </p>

                    </div>

                  </div>

                </td>

                <td className="text-center">

                  {customer.phone}

                </td>

                <td className="text-center font-black">

                  0

                </td>

                <td className="text-center font-black text-green-600">

                  ₦0

                </td>

                <td className="text-center">

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">

                    New

                  </span>

                </td>

                <td className="text-right text-gray-500">

                  {new Date(
                    customer.created_at
                  ).toLocaleDateString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}