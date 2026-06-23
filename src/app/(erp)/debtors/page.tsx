"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<any[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [creditLimit, setCreditLimit] =
    useState("");

  useEffect(() => {
    fetchDebtors();
  }, []);

  async function fetchDebtors() {
    const { data } = await supabase
      .from("debtors")
      .select("*")
      .order("id", {
        ascending: false,
      });

    setDebtors(data || []);
  }

  async function addDebtor() {
    if (!customerName) {
      alert("Enter customer name");
      return;
    }

    const { error } = await supabase
      .from("debtors")
      .insert([
        {
          customer_name: customerName,
          phone,
          location,
          credit_limit:
            Number(creditLimit) || 0,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setCustomerName("");
    setPhone("");
    setLocation("");
    setCreditLimit("");

    fetchDebtors();
  }

  const totalDebt =
    debtors.reduce(
      (sum, d) =>
        sum + Number(d.balance || 0),
      0
    );

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Debtors Management
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p>Total Debtors</p>
          <h2 className="text-3xl font-bold">
            {debtors.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p>Total Outstanding</p>
          <h2 className="text-3xl font-bold text-red-600">
            ₦{totalDebt.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p>Active Accounts</p>
          <h2 className="text-3xl font-bold text-green-600">
            {debtors.length}
          </h2>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Add Debtor
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            placeholder="Credit Limit"
            value={creditLimit}
            onChange={(e) =>
              setCreditLimit(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

        </div>

        <button
          onClick={addDebtor}
          className="mt-6 bg-blue-950 text-white px-6 py-3 rounded-xl"
        >
          Add Debtor
        </button>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

        <h2 className="text-2xl font-bold mb-6">
          Debtors List
        </h2>

        <table className="w-full">

          <thead>

            <tr>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Location
              </th>

              <th className="text-left p-4">
                Credit Limit
              </th>

              <th className="text-left p-4">
                Balance
              </th>

              <th className="text-left p-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {debtors.map((debtor) => (

              <tr
                key={debtor.id}
                className="border-t"
              >

                <td className="p-4">
                  {debtor.customer_name}
                </td>

                <td className="p-4">
                  {debtor.phone}
                </td>

                <td className="p-4">
                  {debtor.location}
                </td>

                <td className="p-4">
                  ₦{debtor.credit_limit}
                </td>

                <td className="p-4 font-bold text-red-600">
                  ₦{debtor.balance}
                </td>

                <td className="p-4">
                  {debtor.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}