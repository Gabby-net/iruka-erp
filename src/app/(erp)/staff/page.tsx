"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import { supabase } from "@/lib/supabase";

export default function StaffPage() {

  /* =========================
     STATES
  ========================== */

  const [staff, setStaff] =
    useState<any[]>([]);

  const [debts, setDebts] =
    useState<any[]>([]);

  const [payrollHistory, setPayrollHistory] =
    useState<any[]>([]);

  const [fullName, setFullName] =
    useState("");
    const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

  const [department, setDepartment] =
    useState("");

  const [role, setRole] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [selectedStaff, setSelectedStaff] =
    useState("");

  const [debtReason, setDebtReason] =
    useState("");

  const [debtAmount, setDebtAmount] =
    useState("");

  useEffect(() => {

    fetchData();

  }, []);

  /* =========================
     FETCH DATA
  ========================== */

  async function fetchData() {

    /* STAFF */

    const {
      data: staffData,
    } = await supabase

      .from("staff")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    /* DEBTS */

    const {
      data: debtData,
    } = await supabase

      .from("staff_debts")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    /* PAYROLL */

    const {
      data: payrollData,
    } = await supabase

      .from("payroll")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    setStaff(staffData || []);

    setDebts(debtData || []);

    setPayrollHistory(
      payrollData || []
    );
  }

  /* =========================
     ADD STAFF
  ========================== */

  async function addStaff() {

  if (
    !fullName ||
    !email ||
    !password ||
    !department ||
    !role ||
    !salary
  ) {

    alert("Fill all fields");

    return;
  }

  try {

    const response =
      await fetch(
        "/api/create-user",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
            fullName,
            role,
          }),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {

      alert(result.error);

      return;
    }

    await supabase
      .from("staff")
      .insert([
        {
          full_name: fullName,
          email,
          department,
          role,
          salary:
            Number(salary),
        },
      ]);

    setFullName("");
    setEmail("");
    setPassword("");
    setDepartment("");
    setRole("");
    setSalary("");

    fetchData();

    alert(
      "User account created successfully"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to create user"
    );
  }
}

  /* =========================
     ADD DEBT
  ========================== */

  async function addDebt() {

    if (
      !selectedStaff ||
      !debtReason ||
      !debtAmount
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    await supabase

      .from("staff_debts")

      .insert([
        {
          staff_name:
            selectedStaff,

          reason:
            debtReason,

          amount:
            Number(
              debtAmount
            ),
        },
      ]);

    setSelectedStaff("");
    setDebtReason("");
    setDebtAmount("");

    fetchData();

    alert(
      "Debt added successfully"
    );
  }

  /* =========================
     TOTAL DEBT
  ========================== */

  function getTotalDebt(
    staffName: string
  ) {

    return debts

      .filter(
        (debt) =>
          debt.staff_name ===
          staffName
      )

      .reduce(
        (sum, debt) =>
          sum +
          Number(debt.amount),
        0
      );
  }

  /* =========================
     PAY SALARY
  ========================== */

  async function paySalary(
    member: any
  ) {

    const totalDebt =
      getTotalDebt(
        member.full_name
      );

    const finalPay =
      Number(member.salary) -
      totalDebt;

    const currentMonth =
      new Date().toLocaleString(
        "default",
        {
          month: "long",
          year: "numeric",
        }
      );

    await supabase

      .from("payroll")

      .insert([
        {
          staff_name:
            member.full_name,

          amount_paid:
            finalPay,

          payment_month:
            currentMonth,

          payment_status:
            "Paid",
        },
      ]);

    alert(
      `${member.full_name} salary paid successfully`
    );

    fetchData();
  }

  return (

    <ProtectedRoute
      allowedRoles={[
        "admin",
        "accountant",
      ]}
    >

      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-blue-950">

            Staff & Payroll System

          </h1>

          <p className="text-gray-600 mt-2 text-lg">

            Enterprise salary and debt management

          </p>

        </div>

        {/* ADD STAFF */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Add Staff

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
  type="text"
  placeholder="Full Name"

  value={fullName}

  onChange={(e) =>
    setFullName(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

<input
  type="email"
  placeholder="Email"

  value={email}

  onChange={(e) =>
    setEmail(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

<input
  type="password"
  placeholder="Password"

  value={password}

  onChange={(e) =>
    setPassword(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

<input
  type="text"
  placeholder="Department"

  value={department}

  onChange={(e) =>
    setDepartment(
      e.target.value
    )
  }

  className="border-2 p-4 rounded-2xl"
/>

            <input
              type="text"
              placeholder="Role"

              value={role}

              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            <input
              type="number"
              placeholder="Monthly Salary"

              value={salary}

              onChange={(e) =>
                setSalary(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

          </div>

          <button
            onClick={addStaff}

            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white p-4 rounded-2xl font-bold"
          >

            Add Staff

          </button>

        </div>

        {/* ADD STAFF DEBT */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            Record Staff Debt / Advance

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <select
              value={selectedStaff}

              onChange={(e) =>
                setSelectedStaff(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            >

              <option value="">

                Select Staff

              </option>

              {staff.map(
                (member) => (

                  <option
                    key={member.id}
                    value={
                      member.full_name
                    }
                  >

                    {
                      member.full_name
                    }

                  </option>
                )
              )}

            </select>

            <input
              type="text"
              placeholder="Reason"

              value={debtReason}

              onChange={(e) =>
                setDebtReason(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            <input
              type="number"
              placeholder="Debt Amount"

              value={debtAmount}

              onChange={(e) =>
                setDebtAmount(
                  e.target.value
                )
              }

              className="border-2 p-4 rounded-2xl"
            />

            <button
              onClick={addDebt}

              className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl font-bold"
            >

              Add Debt

            </button>

          </div>

        </div>

        {/* STAFF PAYROLL TABLE */}

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">

            Staff Payroll Ledger Test

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Staff

                  </th>

                  <th className="p-4 text-left">

                    Department

                  </th>

                  <th className="p-4 text-left">

                    Salary

                  </th>

                  <th className="p-4 text-left">

                    Debt

                  </th>

                  <th className="p-4 text-left">

                    Balance Pay

                  </th>

                  <th className="p-4 text-left">

                    Action

                  </th>

                </tr>

              </thead>

              <tbody>

                {staff.map(
                  (member) => {

                    const totalDebt =
                      getTotalDebt(
                        member.full_name
                      );

                    const balancePay =
                      Number(
                        member.salary
                      ) -
                      totalDebt;

                    return (

                      <tr
                        key={member.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-4 font-semibold">

                          {
                            member.full_name
                          }

                        </td>

                        <td className="p-4">

                          {
                            member.department
                          }

                        </td>

                        <td className="p-4 text-green-700 font-bold">

                          ₦
                          {Number(
                            member.salary
                          ).toLocaleString()}

                        </td>

                        <td className="p-4 text-red-600 font-bold">

                          ₦
                          {totalDebt.toLocaleString()}

                        </td>

                        <td className="p-4 text-blue-950 font-black">

                          ₦
                          {balancePay.toLocaleString()}

                        </td>

                        <td className="p-4">

                          <button
                            onClick={() =>
                              paySalary(
                                member
                              )
                            }

                            className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-bold"
                          >

                            Pay Salary

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* PAYROLL HISTORY */}

        <div className="bg-white rounded-3xl shadow p-8 mt-10">

          <h2 className="text-3xl font-bold mb-6">

            Payroll Payment History

          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="p-4 text-left">

                    Staff

                  </th>

                  <th className="p-4 text-left">

                    Amount Paid

                  </th>

                  <th className="p-4 text-left">

                    Month

                  </th>

                  <th className="p-4 text-left">

                    Status

                  </th>

                  <th className="p-4 text-left">

                    Date

                  </th>

                </tr>

              </thead>

              <tbody>

                {payrollHistory.map(
                  (payment) => (

                    <tr
                      key={payment.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-semibold">

                        {
                          payment.staff_name
                        }

                      </td>

                      <td className="p-4 text-green-700 font-bold">

                        ₦
                        {Number(
                          payment.amount_paid
                        ).toLocaleString()}

                      </td>

                      <td className="p-4">

                        {
                          payment.payment_month
                        }

                      </td>

                      <td className="p-4 text-blue-950 font-bold">

                        {
                          payment.payment_status
                        }

                      </td>

                      <td className="p-4">

                        {new Date(
                          payment.created_at
                        ).toLocaleString()}

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