"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

export default function PayrollPage() {
const [staff, setStaff] =
useState<any[]>([]);

const [payroll, setPayroll] =
useState<any[]>([]);

useEffect(() => {
fetchData();
}, []);

async function fetchData() {
const { data: staffData } =
await supabase
.from("staff")
.select("*");

const { data: payrollData } =
  await supabase
    .from("payroll")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

setStaff(staffData || []);
setPayroll(payrollData || []);

}

async function generatePayroll() {
const currentMonth =
new Date().toLocaleString(
"default",
{
month: "long",
year: "numeric",
}
);

for (const member of staff) {
  const existing =
    payroll.find(
      (p) =>
        p.staff_id ===
          member.id &&
        p.month ===
          currentMonth
    );

  if (existing) continue;

  await supabase
    .from("payroll")
    .insert([
      {
        staff_id:
          member.id,
        month:
          currentMonth,
        basic_salary:
          Number(
            member.salary
          ),
        bonus: 0,
        deduction: 0,
        net_salary:
          Number(
            member.salary
          ),
        payment_status:
          "Pending",
      },
    ]);
}

alert(
  "Payroll Generated Successfully"
);

fetchData();
}

async function markPaid(
payrollId: number
) {
await supabase
.from("payroll")
.update({
payment_status:
"Paid",
})
.eq(
"id",
payrollId
);

fetchData();

}

const totalStaff =
staff.length;

const monthlyPayroll =
payroll.reduce(
(sum, item) =>
sum +
Number(
item.net_salary || 0
),
0
);

const paidCount =
payroll.filter(
(p) =>
p.payment_status ===
"Paid"
).length;

const pendingCount =
payroll.filter(
(p) =>
p.payment_status ===
"Pending"
).length;

return (
<ProtectedRoute
allowedRoles={[
"admin",
"accountant",
]}
> <div className="p-10 bg-gray-100 min-h-screen">

    <div className="mb-10">
      <h1 className="text-5xl font-black text-blue-950">
        Payroll Management
      </h1>

      <p className="text-gray-600 mt-2">
        Staff salary administration
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-6 mb-10">

      <div className="bg-white rounded-3xl shadow p-6">
        <p>Total Staff</p>
        <h2 className="text-4xl font-black">
          {totalStaff}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <p>Monthly Payroll</p>
        <h2 className="text-4xl font-black text-green-700">
          ₦
          {monthlyPayroll.toLocaleString()}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <p>Paid Salaries</p>
        <h2 className="text-4xl font-black text-blue-950">
          {paidCount}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <p>Pending Salaries</p>
        <h2 className="text-4xl font-black text-red-600">
          {pendingCount}
        </h2>
      </div>

    </div>

    <div className="bg-white rounded-3xl shadow p-8 mb-10">

      <button
        onClick={
          generatePayroll
        }
        className="bg-blue-950 text-white px-6 py-4 rounded-2xl font-bold"
      >
        Generate Payroll
      </button>

    </div>

    <div className="bg-white rounded-3xl shadow p-8">

      <h2 className="text-3xl font-bold mb-6">
        Payroll Records
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="p-4 text-left">
                Staff ID
              </th>

              <th className="p-4 text-left">
                Month
              </th>

              <th className="p-4 text-left">
                Salary
              </th>

              <th className="p-4 text-left">
                Bonus
              </th>

              <th className="p-4 text-left">
                Deduction
              </th>

              <th className="p-4 text-left">
                Net Salary
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {payroll.map(
              (item) => (

                <tr
                  key={
                    item.id
                  }
                  className="border-b"
                >

                  <td className="p-4">
                    {
                      item.staff_id
                    }
                  </td>

                  <td className="p-4">
                    {
                      item.month
                    }
                  </td>

                  <td className="p-4">
                    ₦
                    {Number(
                      item.basic_salary
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    ₦
                    {Number(
                      item.bonus
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    ₦
                    {Number(
                      item.deduction
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 font-bold text-green-700">
                    ₦
                    {Number(
                      item.net_salary
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">

                    <span
                      className={
                        item.payment_status ===
                        "Paid"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {
                        item.payment_status
                      }
                    </span>

                  </td>

                  <td className="p-4">

                    {item.payment_status !==
                      "Paid" && (
                      <button
                        onClick={() =>
                          markPaid(
                            item.id
                          )
                        }
                        className="bg-green-700 text-white px-4 py-2 rounded-xl"
                      >
                        Mark Paid
                      </button>
                    )}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>

      </div>

    </ProtectedRoute>

  );
}