
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useMemo, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

import {
  Users,
  Wallet,
  Landmark,
  Printer,
  Download,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

interface Staff {
  id: number;
  full_name: string;
  department: string;
  position: string;
  salary: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  employment_status: string;
  date_joined: string;
}

interface Debt {
  id: number;
  staff_name: string;
  amount: number;
  month: string;
  year: number;
  status: string;
}

interface Payroll {
  id: number;
  staff_id: number;
  staff_name: string;
  department: string;
  position: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  basic_salary: number;
  days_worked: number;
  salary_earned: number;
  total_deduction: number;
  balance_payable: number;
  payroll_month: string;
  payroll_year: number;
  payment_status: string;
  created_at: string;
}

/* =====================================================
   HELPERS
===================================================== */

function money(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function getMonthName(monthIndex: number) {
  return new Date(2000, monthIndex, 1).toLocaleString("default", {
    month: "long",
  });
}

/* =====================================================
   PAGE
===================================================== */

export default function PayrollPage() {
  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [staff, setStaff] = useState<Staff[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);

  const [selectedPayroll, setSelectedPayroll] = useState<Payroll[]>([]);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  const [search, setSearch] = useState("");

  const today = new Date();

  /*
    Payroll always belongs to the CURRENT calendar month.

    Example:
    August 1 - August 31 = August payroll
    September 1 - September 30 = September payroll
  */

  const payrollMonth = getMonthName(today.getMonth());
  const payrollYear = today.getFullYear();

  /* =====================================================
     CURRENT MONTH DATE INFORMATION
  ===================================================== */

  const daysInMonth = new Date(
    payrollYear,
    today.getMonth() + 1,
    0
  ).getDate();

  const monthStart = new Date(
    payrollYear,
    today.getMonth(),
    1
  );

  const monthEnd = new Date(
    payrollYear,
    today.getMonth(),
    daysInMonth
  );

  /* =====================================================
     FETCH DATA
  ===================================================== */

  async function fetchData() {
    try {
      setLoading(true);

      const [
        staffResponse,
        debtResponse,
        payrollResponse,
      ] = await Promise.all([
        supabase
          .from("staff")
          .select(`
            id,
            full_name,
            department,
            position,
            salary,
            bank_name,
            account_name,
            account_number,
            employment_status,
            date_joined
          `)
          .eq("employment_status", "Active")
          .order("full_name"),

        supabase
          .from("staff_debts")
          .select("*")
          .eq("status", "Open"),

        supabase
          .from("payroll")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (staffResponse.error) {
        console.error("Staff Fetch Error:", staffResponse.error);
        alert(staffResponse.error.message);
        return;
      }

      if (debtResponse.error) {
        console.error("Debt Fetch Error:", debtResponse.error);
        alert(debtResponse.error.message);
        return;
      }

      if (payrollResponse.error) {
        console.error("Payroll Fetch Error:", payrollResponse.error);
        alert(payrollResponse.error.message);
        return;
      }

      setStaff(staffResponse.data || []);
      setDebts(debtResponse.data || []);
      setPayroll(payrollResponse.data || []);
    } catch (error: any) {
      console.error("Payroll Fetch Error:", error);
      alert(
        error?.message ||
          "Unable to load payroll information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  /* =====================================================
     STAFF DEBT DEDUCTION

     Only OPEN debts belonging to the current payroll
     month/year are deducted.

     Example:
     August debt -> August payroll deduction.
  ===================================================== */

  function getDeduction(staffName: string) {
    return debts
      .filter(
        (item) =>
          item.staff_name === staffName &&
          item.month === payrollMonth &&
          Number(item.year) === payrollYear &&
          item.status === "Open"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );
  }

  /* =====================================================
     CALCULATE DAYS WORKED

     Payroll period:

     1st day of month
          ↓
     last day of month

     If staff joined before the month:
       full month

     If staff joined during the month:
       joining date → month end

     If staff joins in future:
       0 days
  ===================================================== */

  function calculateDaysWorked(dateJoined: string) {
    if (!dateJoined) {
      return daysInMonth;
    }

    const joinedDate = new Date(dateJoined);

    /*
      Normalize time to prevent timezone problems.
    */

    joinedDate.setHours(0, 0, 0, 0);

    /*
      Staff joined before this payroll month.
    */

    if (joinedDate < monthStart) {
      return daysInMonth;
    }

    /*
      Staff joins after this payroll month.
    */

    if (joinedDate > monthEnd) {
      return 0;
    }

    /*
      Staff joined during this month.

      Example:
      August has 31 days.
      Joined August 10.

      Days worked:
      31 - 10 + 1 = 22 days
    */

    return daysInMonth - joinedDate.getDate() + 1;
  }

  /* =====================================================
     CALCULATE PAYROLL FOR STAFF
  ===================================================== */

  function calculatePayrollForStaff(employee: Staff) {
    const basicSalary = Number(employee.salary || 0);

    const daysWorked = calculateDaysWorked(
      employee.date_joined
    );

    const dailySalary =
      daysInMonth > 0
        ? basicSalary / daysInMonth
        : 0;

    const salaryEarned =
      dailySalary * daysWorked;

    const deduction = getDeduction(
      employee.full_name
    );

    /*
      Never allow negative salary payable.
    */

    const balancePayable = Math.max(
      salaryEarned - deduction,
      0
    );

    return {
      daysWorked,
      salaryEarned,
      deduction,
      balancePayable,
    };
  }

  /* =====================================================
     CHECK WHETHER CURRENT MONTH PAYROLL EXISTS
  ===================================================== */

  const currentMonthPayroll = useMemo(() => {
    return payroll.filter(
      (item) =>
        item.payroll_month === payrollMonth &&
        Number(item.payroll_year) === payrollYear
    );
  }, [payroll, payrollMonth, payrollYear]);

  const payrollAlreadyGenerated =
    currentMonthPayroll.length > 0;

  /* =====================================================
     GENERATE PAYROLL

     IMPORTANT:

     This can be clicked any time during the month.

     The payroll period is ALWAYS:

     1st → last day of current month.

     Once generated, it cannot be generated again
     for the same month.
  ===================================================== */

  async function generatePayroll() {
    if (generating) return;

    /*
      Prevent duplicate generation.
    */

    if (payrollAlreadyGenerated) {
      alert(
        `Payroll for ${payrollMonth} ${payrollYear} has already been generated.`
      );
      return;
    }

    /*
      Make sure there are employees.
    */

    if (staff.length === 0) {
      alert(
        "There are no active staff members available for payroll."
      );
      return;
    }

    try {
      setGenerating(true);

      const payrollRows: any[] = [];

      let grossPayroll = 0;
      let totalDeductions = 0;
      let netPayroll = 0;

      for (const employee of staff) {
        /*
          Calculate this employee's payroll.
        */

        const calculation =
          calculatePayrollForStaff(employee);

        /*
          Future employees should not enter payroll.
        */

        if (calculation.daysWorked <= 0) {
          continue;
        }

        /*
          Bank details are not used to determine whether
          salary is earned.

          We therefore DO NOT skip staff just because
          their bank information is incomplete.

          Their payroll still needs to be recorded.
        */

        grossPayroll +=
          calculation.salaryEarned;

        totalDeductions +=
          calculation.deduction;

        netPayroll +=
          calculation.balancePayable;

        payrollRows.push({
          staff_id: employee.id,

          staff_name: employee.full_name,

          department:
            employee.department || "",

          position:
            employee.position || "",

          bank_name:
            employee.bank_name || "",

          account_name:
            employee.account_name || "",

          account_number:
            employee.account_number || "",

          basic_salary:
            Number(employee.salary || 0),

          days_worked:
            calculation.daysWorked,

          salary_earned:
            calculation.salaryEarned,

          total_deduction:
            calculation.deduction,

          balance_payable:
            calculation.balancePayable,

          payroll_month:
            payrollMonth,

          payroll_year:
            payrollYear,

          payment_status:
            "Ready",
        });
      }

      if (payrollRows.length === 0) {
        alert(
          "No eligible staff members were found for this payroll period."
        );
        return;
      }

      /*
        Insert payroll records.
      */

      const { error: payrollError } =
        await supabase
          .from("payroll")
          .insert(payrollRows);

      if (payrollError) {
        console.error(
          "Payroll Insert Error:",
          payrollError
        );

        alert(payrollError.message);
        return;
      }

      /*
        IMPORTANT:

        We intentionally DO NOT insert into
        payroll_history because that table does not
        currently exist in your Supabase database.
      */

      alert(
        `${payrollMonth} ${payrollYear} payroll generated successfully.\n\n` +
          `Employees: ${payrollRows.length}\n` +
          `Gross Payroll: ${money(grossPayroll)}\n` +
          `Deductions: ${money(totalDeductions)}\n` +
          `Net Payroll: ${money(netPayroll)}`
      );

      await fetchData();
    } catch (error: any) {
      console.error(
        "Generate Payroll Error:",
        error
      );

      alert(
        error?.message ||
          "Unable to generate payroll."
      );
    } finally {
      setGenerating(false);
    }
  }

  /* =====================================================
     PAY SALARY

     This ONLY marks the payroll as Paid.

     It does NOT change the employee's salary.

     It also does NOT automatically mark a staff debt
     as paid because payroll deductions and debt
     settlement are separate accounting events.
  ===================================================== */

  async function paySalary(id: number) {
    const confirmed = window.confirm(
      "Confirm that this salary has actually been paid?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("payroll")
      .update({
        payment_status: "Paid",
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Salary Payment Error:",
        error
      );

      alert(error.message);
      return;
    }

    await fetchData();

    alert("Salary marked as paid successfully.");
  }

  /* =====================================================
     VIEW PAYROLL
  ===================================================== */

  async function viewPayroll(
    month: string,
    year: number
  ) {
    const { data, error } = await supabase
      .from("payroll")
      .select("*")
      .eq("payroll_month", month)
      .eq("payroll_year", year)
      .order("staff_name");

    if (error) {
      console.error(
        "View Payroll Error:",
        error
      );

      alert(error.message);
      return;
    }

    setSelectedPayroll(data || []);
    setShowPayrollModal(true);
  }

  /* =====================================================
     SUMMARY

     Current month only.
  ===================================================== */

  const grossPayroll = useMemo(() => {
    return currentMonthPayroll.reduce(
      (sum, item) =>
        sum + Number(item.salary_earned || 0),
      0
    );
  }, [currentMonthPayroll]);

  const totalDeductions = useMemo(() => {
    return currentMonthPayroll.reduce(
      (sum, item) =>
        sum + Number(item.total_deduction || 0),
      0
    );
  }, [currentMonthPayroll]);

  const netPayroll = useMemo(() => {
    return currentMonthPayroll.reduce(
      (sum, item) =>
        sum + Number(item.balance_payable || 0),
      0
    );
  }, [currentMonthPayroll]);

  const paidPayroll = useMemo(() => {
    return currentMonthPayroll
      .filter(
        (item) =>
          item.payment_status === "Paid"
      )
      .reduce(
        (sum, item) =>
          sum +
          Number(item.balance_payable || 0),
        0
      );
  }, [currentMonthPayroll]);

  const outstandingPayroll = Math.max(
    netPayroll - paidPayroll,
    0
  );

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredPayroll = useMemo(() => {
    return currentMonthPayroll.filter(
      (item) =>
        item.staff_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(item.staff_id)
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.department || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [
    currentMonthPayroll,
    search,
  ]);

  /* =====================================================
     DOWNLOAD PAYROLL
  ===================================================== */

  function downloadPayroll() {
    if (currentMonthPayroll.length === 0) {
      alert(
        "Generate this month's payroll before downloading."
      );
      return;
    }

    const doc = new jsPDF();

    /*
      Header
    */

    doc.setFillColor(15, 23, 42);

    doc.rect(
      0,
      0,
      210,
      35,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(22);

    doc.text(
      "IRUKA INDUSTRIES LTD",
      105,
      16,
      {
        align: "center",
      }
    );

    doc.setFontSize(13);

    doc.text(
      "MONTHLY PAYROLL REPORT",
      105,
      25,
      {
        align: "center",
      }
    );

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(11);

    doc.text(
      `Payroll Period: 1 - ${daysInMonth} ${payrollMonth} ${payrollYear}`,
      14,
      45
    );

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      140,
      45
    );

    autoTable(doc, {
      startY: 55,

      theme: "grid",

      headStyles: {
        fillColor: [
          15,
          23,
          42,
        ],

        textColor: [
          255,
          255,
          255,
        ],

        fontStyle: "bold",

        halign: "center",
      },

      alternateRowStyles: {
        fillColor: [
          245,
          247,
          250,
        ],
      },

      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
      },

      head: [
        [
          "Staff ID",
          "Staff",
          "Department",
          "Position",
          "Salary",
          "Days",
          "Earned",
          "Deduction",
          "Net Pay",
          "Status",
        ],
      ],

      body: currentMonthPayroll.map(
        (item) => [
          item.staff_id,

          item.staff_name,

          item.department,

          item.position,

          money(
            Number(
              item.basic_salary
            )
          ),

          item.days_worked,

          money(
            Number(
              item.salary_earned
            )
          ),

          money(
            Number(
              item.total_deduction
            )
          ),

          money(
            Number(
              item.balance_payable
            )
          ),

          item.payment_status,
        ]
      ),
    });

    const finalY =
      (doc as any).lastAutoTable
        .finalY + 15;

    doc.setFontSize(12);

    doc.setDrawColor(200);

    doc.roundedRect(
      14,
      finalY,
      182,
      28,
      2,
      2
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Gross Payroll",
      18,
      finalY + 8
    );

    doc.text(
      money(grossPayroll),
      18,
      finalY + 18
    );

    doc.text(
      "Deductions",
      78,
      finalY + 8
    );

    doc.text(
      money(totalDeductions),
      78,
      finalY + 18
    );

    doc.text(
      "Net Payroll",
      150,
      finalY + 8
    );

    doc.text(
      money(netPayroll),
      150,
      finalY + 18
    );

    const signY =
      finalY + 50;

    doc.line(
      18,
      signY,
      70,
      signY
    );

    doc.text(
      "Prepared By",
      25,
      signY + 6
    );

    doc.line(
      82,
      signY,
      134,
      signY
    );

    doc.text(
      "Finance Manager",
      88,
      signY + 6
    );

    doc.line(
      146,
      signY,
      198,
      signY
    );

    doc.text(
      "CEO Approval",
      154,
      signY + 6
    );

    doc.setFontSize(9);

    doc.setTextColor(
      120,
      120,
      120
    );

    doc.text(
      "Generated automatically by IRUKA ERP System",
      105,
      290,
      {
        align: "center",
      }
    );

    doc.save(
      `Payroll-${payrollMonth}-${payrollYear}.pdf`
    );
  }

  /* =====================================================
     PRINT
  ===================================================== */

  function printPayroll() {
    if (currentMonthPayroll.length === 0) {
      alert(
        "Generate this month's payroll before printing."
      );
      return;
    }

    window.print();
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl font-semibold">
          Loading Payroll...
        </p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <ProtectedRoute
      allowedRoles={[
        "admin",
        "accountant",
      ]}
    >
      <div className="min-h-screen bg-slate-100 p-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-900 to-slate-900 p-8 shadow-2xl mb-8">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            <div>

              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-4 py-2 text-blue-300 text-sm font-semibold">
                Payroll Management
              </span>

              <h1 className="mt-5 text-5xl font-black text-white">
                Monthly Payroll
              </h1>

              <p className="mt-3 text-slate-300 text-lg">
                Payroll runs from the 1st through the last
                day of every month.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Payroll Month
                </p>

                <h2 className="text-2xl font-bold text-white mt-2">
                  {payrollMonth}{" "}
                  {payrollYear}
                </h2>

              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Payroll Period
                </p>

                <h2 className="text-xl font-bold text-white mt-2">
                  1 - {daysInMonth}
                </h2>

              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Company
                </p>

                <h2 className="text-lg font-bold text-amber-400 mt-2">
                  IRUKA INDUSTRIES LTD
                </h2>

              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Status
                </p>

                <h2
                  className={`text-lg font-bold mt-2 ${
                    payrollAlreadyGenerated
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {payrollAlreadyGenerated
                    ? "GENERATED"
                    : "READY"}
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="rounded-3xl bg-white shadow-xl p-7">

            <div className="flex items-center justify-between">

              <Users
                className="text-blue-700"
                size={40}
              />

              <span className="text-sm font-semibold text-slate-500">
                Employees
              </span>

            </div>

            <h2 className="text-4xl font-black text-slate-900 mt-6">
              {currentMonthPayroll.length ||
                staff.length}
            </h2>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-7">

            <div className="flex items-center justify-between">

              <Wallet
                className="text-green-600"
                size={40}
              />

              <span className="text-sm font-semibold text-slate-500">
                Gross Payroll
              </span>

            </div>

            <h2 className="text-3xl font-black text-green-700 mt-6">
              {money(grossPayroll)}
            </h2>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-7">

            <div className="flex items-center justify-between">

              <Landmark
                className="text-red-600"
                size={40}
              />

              <span className="text-sm font-semibold text-slate-500">
                Deductions
              </span>

            </div>

            <h2 className="text-3xl font-black text-red-600 mt-6">
              {money(totalDeductions)}
            </h2>

          </div>

          <div className="rounded-3xl bg-white shadow-xl p-7">

            <div className="flex items-center justify-between">

              <FileSpreadsheet
                className="text-amber-500"
                size={40}
              />

              <span className="text-sm font-semibold text-slate-500">
                Balance Payable
              </span>

            </div>

            <h2 className="text-3xl font-black text-slate-900 mt-6">
              {money(netPayroll)}
            </h2>

            {payrollAlreadyGenerated && (
              <p className="text-sm text-slate-500 mt-3">
                Outstanding:{" "}
                <span className="font-bold text-red-600">
                  {money(
                    outstandingPayroll
                  )}
                </span>
              </p>
            )}

          </div>

        </div>

        {/* =====================================================
            CONTROLS
        ===================================================== */}

        <div className="rounded-3xl bg-white shadow-xl p-8 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h2 className="text-3xl font-black text-slate-900">
                Payroll Controls
              </h2>

              <p className="text-slate-500 mt-2">
                Generate the current month's payroll,
                download the payroll sheet or print it.
              </p>

              {!payrollAlreadyGenerated && (
                <p className="text-blue-700 font-semibold mt-2">
                  Payroll period: 1 - {daysInMonth}{" "}
                  {payrollMonth} {payrollYear}
                </p>
              )}

            </div>

            <div className="flex flex-wrap gap-4">

              <button
                onClick={generatePayroll}
                disabled={
                  generating ||
                  payrollAlreadyGenerated
                }
                className={`rounded-2xl px-6 py-4 text-white font-bold transition ${
                  generating ||
                  payrollAlreadyGenerated
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-950"
                }`}
              >
                {generating
                  ? "Generating..."
                  : payrollAlreadyGenerated
                  ? "Payroll Generated"
                  : "Generate Payroll"}
              </button>

              <button
                onClick={downloadPayroll}
                className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-6 py-4 text-white font-bold transition flex items-center gap-2"
              >
                <Download size={18} />
                Download
              </button>

              <button
                onClick={printPayroll}
                className="rounded-2xl bg-slate-800 hover:bg-black px-6 py-4 text-white font-bold transition flex items-center gap-2"
              >
                <Printer size={18} />
                Print
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="rounded-3xl bg-white shadow-xl p-6 mb-8">

          <div className="flex items-center justify-between gap-5">

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search employee..."
              className="w-full lg:w-96 rounded-2xl border-2 border-slate-200 px-5 py-4 outline-none focus:border-blue-800"
            />

            <div className="flex items-center gap-2 text-slate-600">

              <CalendarDays size={20} />

              <span className="font-semibold">
                {payrollMonth}{" "}
                {payrollYear}
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            PAYROLL TABLE
        ===================================================== */}

        <div className="rounded-3xl bg-white shadow-xl overflow-hidden mb-10">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-900 text-white">

                  <th className="px-6 py-5 text-left">
                    Staff ID
                  </th>

                  <th className="px-6 py-5 text-left">
                    Staff
                  </th>

                  <th className="px-6 py-5 text-left">
                    Department
                  </th>

                  <th className="px-6 py-5 text-left">
                    Position
                  </th>

                  <th className="px-6 py-5 text-left">
                    Bank
                  </th>

                  <th className="px-6 py-5 text-left">
                    Account No.
                  </th>

                  <th className="px-6 py-5 text-right">
                    Salary
                  </th>

                  <th className="px-6 py-5 text-center">
                    Days Worked
                  </th>

                  <th className="px-6 py-5 text-right">
                    Salary Earned
                  </th>

                  <th className="px-6 py-5 text-right">
                    Deduction
                  </th>

                  <th className="px-6 py-5 text-right">
                    Balance
                  </th>

                  <th className="px-6 py-5 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayroll.length === 0 ? (

                  <tr>

                    <td
                      colSpan={12}
                      className="text-center py-16 text-slate-500"
                    >
                      {payrollAlreadyGenerated
                        ? "No payroll records match your search."
                        : "No payroll generated for this month."}
                    </td>

                  </tr>

                ) : (

                  filteredPayroll.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className="border-b hover:bg-slate-50"
                      >

                        <td className="px-6 py-5 font-bold text-blue-700">
                          {item.staff_id}
                        </td>

                        <td className="px-6 py-5">

                          <div>

                            <p className="font-bold text-slate-900">
                              {item.staff_name}
                            </p>

                            <p className="text-sm text-slate-500">
                              {item.account_name ||
                                "No account name"}
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5">
                          {item.department}
                        </td>

                        <td className="px-6 py-5">
                          {item.position}
                        </td>

                        <td className="px-6 py-5">
                          {item.bank_name ||
                            "-"}
                        </td>

                        <td className="px-6 py-5 font-mono">
                          {item.account_number ||
                            "-"}
                        </td>

                        <td className="px-6 py-5 text-right font-semibold">
                          {money(
                            Number(
                              item.basic_salary
                            )
                          )}
                        </td>

                        <td className="px-6 py-5 text-center font-semibold">
                          {item.days_worked}
                        </td>

                        <td className="px-6 py-5 text-right font-semibold text-blue-700">
                          {money(
                            Number(
                              item.salary_earned
                            )
                          )}
                        </td>

                        <td className="px-6 py-5 text-right text-red-600 font-semibold">
                          {money(
                            Number(
                              item.total_deduction
                            )
                          )}
                        </td>

                        <td className="px-6 py-5 text-right text-green-700 font-bold">
                          {money(
                            Number(
                              item.balance_payable
                            )
                          )}
                        </td>

                        <td className="px-6 py-5 text-center">

                          <div className="flex items-center justify-center gap-3">

                            <span
                              className={`rounded-full px-4 py-2 text-sm font-bold ${
                                item.payment_status ===
                                "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {
                                item.payment_status
                              }
                            </span>

                            {item.payment_status ===
                              "Ready" && (

                              <button
                                onClick={() =>
                                  paySalary(
                                    item.id
                                  )
                                }
                                className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 text-xs font-bold"
                              >
                                Pay
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =====================================================
            PAYROLL RECORDS
        ===================================================== */}

        <div className="rounded-3xl bg-white shadow-xl p-8">

          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Payroll Records
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-900 text-white">

                  <th className="px-6 py-5 text-left">
                    Month
                  </th>

                  <th className="px-6 py-5 text-center">
                    Employees
                  </th>

                  <th className="px-6 py-5 text-right">
                    Gross Payroll
                  </th>

                  <th className="px-6 py-5 text-right">
                    Deductions
                  </th>

                  <th className="px-6 py-5 text-right">
                    Net Payroll
                  </th>

                  <th className="px-6 py-5 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {Array.from(
                  new Map(
                    payroll.map(
                      (item) => [
                        `${item.payroll_month}-${item.payroll_year}`,
                        item,
                      ]
                    )
                  ).values()
                ).map((row) => {

                  const monthPayroll =
                    payroll.filter(
                      (item) =>
                        item.payroll_month ===
                          row.payroll_month &&
                        Number(
                          item.payroll_year
                        ) ===
                          Number(
                            row.payroll_year
                          )
                    );

                  const historicalGross =
                    monthPayroll.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.salary_earned ||
                            0
                        ),
                      0
                    );

                  const historicalDeductions =
                    monthPayroll.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.total_deduction ||
                            0
                        ),
                      0
                    );

                  const historicalNet =
                    monthPayroll.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.balance_payable ||
                            0
                        ),
                      0
                    );

                  return (
                    <tr
                      key={`${row.payroll_month}-${row.payroll_year}`}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="px-6 py-5 font-semibold">
                        {row.payroll_month}{" "}
                        {row.payroll_year}
                      </td>

                      <td className="px-6 py-5 text-center">
                        {
                          monthPayroll.length
                        }
                      </td>

                      <td className="px-6 py-5 text-right">
                        {money(
                          historicalGross
                        )}
                      </td>

                      <td className="px-6 py-5 text-right text-red-600">
                        {money(
                          historicalDeductions
                        )}
                      </td>

                      <td className="px-6 py-5 text-right text-green-700 font-bold">
                        {money(
                          historicalNet
                        )}
                      </td>

                      <td className="px-6 py-5 text-center">

                        <button
                          onClick={() =>
                            viewPayroll(
                              row.payroll_month,
                              Number(
                                row.payroll_year
                              )
                            )
                          }
                          className="rounded-xl bg-blue-900 hover:bg-blue-950 text-white px-5 py-2"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })}

                {payroll.length === 0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-14 text-slate-500"
                    >
                      No payroll records found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =====================================================
          PAYROLL DETAILS MODAL
      ===================================================== */}

      {showPayrollModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl shadow-2xl w-[95%] max-w-6xl max-h-[85vh] overflow-y-auto p-8">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-3xl font-black">
                  Payroll Details
                </h2>

                {selectedPayroll.length >
                  0 && (

                  <p className="text-slate-500 mt-1">
                    {
                      selectedPayroll[0]
                        .payroll_month
                    }{" "}
                    {
                      selectedPayroll[0]
                        .payroll_year
                    }
                  </p>

                )}

              </div>

              <button
                onClick={() =>
                  setShowPayrollModal(false)
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                Close
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-900 text-white">

                    <th className="p-4 text-left">
                      Staff
                    </th>

                    <th className="p-4 text-left">
                      Department
                    </th>

                    <th className="p-4 text-right">
                      Salary
                    </th>

                    <th className="p-4 text-center">
                      Days
                    </th>

                    <th className="p-4 text-right">
                      Earned
                    </th>

                    <th className="p-4 text-right">
                      Deduction
                    </th>

                    <th className="p-4 text-right">
                      Net Pay
                    </th>

                    <th className="p-4 text-center">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedPayroll.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className="border-b"
                      >

                        <td className="p-4">
                          {item.staff_name}
                        </td>

                        <td className="p-4">
                          {item.department}
                        </td>

                        <td className="p-4 text-right">
                          {money(
                            Number(
                              item.basic_salary
                            )
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {item.days_worked}
                        </td>

                        <td className="p-4 text-right">
                          {money(
                            Number(
                              item.salary_earned
                            )
                          )}
                        </td>

                        <td className="p-4 text-right text-red-600">
                          {money(
                            Number(
                              item.total_deduction
                            )
                          )}
                        </td>

                        <td className="p-4 text-right text-green-700 font-bold">
                          {money(
                            Number(
                              item.balance_payable
                            )
                          )}
                        </td>

                        <td className="p-4 text-center">

                          <span
                            className={`px-4 py-2 rounded-full font-semibold ${
                              item.payment_status ===
                              "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              item.payment_status
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </ProtectedRoute>
  );
}
