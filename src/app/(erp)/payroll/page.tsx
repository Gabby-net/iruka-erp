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

interface Debt{

  id:number;

  staff_name:string;

  amount:number;

  month:string;

  year:number;

  status:string;

}

interface Payroll{

  id:number;

  staff_id:number;

  staff_name:string;

  department:string;

  position:string;

  bank_name:string;

  account_name:string;

  account_number:string;

  basic_salary:number;

  days_worked: number;

salary_earned: number;

  total_deduction:number;

  balance_payable:number;

  payroll_month:string;

  payroll_year:number;

  payment_status:string;

  created_at:string;

}

interface PayrollHistory{

  id:number;

  payroll_month:string;

  payroll_year:number;

  total_staff:number;

  gross_payroll:number;

  total_deductions:number;

  net_payroll:number;

  created_at:string;

}

/* =====================================================
   PAGE
===================================================== */

export default function PayrollPage(){

/* =====================================================
   STATES
===================================================== */

const [loading,setLoading]=useState(true);

const [staff,setStaff]=useState<Staff[]>([]);

const [debts,setDebts]=useState<Debt[]>([]);

const [payroll,setPayroll]=useState<Payroll[]>([]);

const [history,setHistory]=useState<PayrollHistory[]>([]);

const [selectedPayroll,setSelectedPayroll]=useState<Payroll[]>([]);
const [showPayrollModal,setShowPayrollModal]=useState(false);

const [search,setSearch]=useState("");

const today=new Date();

const payrollMonth=today.toLocaleString("default",{

month:"long"

});

const payrollYear=today.getFullYear();

/* =====================================================
   LOAD DATA
===================================================== */

async function fetchData(){

setLoading(true);

const { data: staffData } = await supabase
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
  .order("full_name");

const {data:debtData}=await supabase

.from("staff_debts")

.select("*")

.eq("status","Open");

const {data:payrollData}=await supabase

.from("payroll")

.select("*")

.order("created_at",{ascending:false});

const {data:historyData}=await supabase

.from("payroll_history")

.select("*")

.order("created_at",{ascending:false});

setStaff(staffData||[]);

setDebts(debtData||[]);

setPayroll(payrollData||[]);

setHistory(historyData||[]);

setLoading(false);

}

useEffect(()=>{

fetchData();

},[]);

/* =====================================================
   HELPERS
===================================================== */

function getDeduction(name:string){

return debts

.filter(

(item)=>

item.staff_name===name &&

item.month===payrollMonth &&

item.year===payrollYear

)

.reduce(

(sum,item)=>

sum+Number(item.amount||0),

0

);

}

/* =====================================================
   GENERATE PAYROLL
===================================================== */

async function generatePayroll(){

const existing=payroll.filter(

(item)=>

item.payroll_month===payrollMonth &&

item.payroll_year===payrollYear

);

if(existing.length>0){

alert("Payroll for this month has already been generated.");

return;

}

let grossPayroll=0;

let totalDeductions=0;

let netPayroll=0;

const payrollRows=[];

for(const employee of staff){

  if (
    !employee.bank_name ||
    !employee.account_name ||
    !employee.account_number
) {
    continue;
}

const deduction = getDeduction(employee.full_name);

// Current month information
const daysInMonth = new Date(
  payrollYear,
  today.getMonth() + 1,
  0
).getDate();

const joinedDate = new Date(employee.date_joined);

let daysWorked;

// Joined before this payroll month
if (
  joinedDate.getFullYear() < payrollYear ||
  (
    joinedDate.getFullYear() === payrollYear &&
    joinedDate.getMonth() < today.getMonth()
  )
) {

  daysWorked = daysInMonth;

}

// Joined during this payroll month
else if (
  joinedDate.getFullYear() === payrollYear &&
  joinedDate.getMonth() === today.getMonth()
) {

  daysWorked =
    daysInMonth - joinedDate.getDate() + 1;

}

// Joined in the future
else {

  daysWorked = 0;

}

// Daily Salary
const dailySalary =
  Number(employee.salary || 0) /
  daysInMonth;

// Salary Earned
const earnedSalary =
  dailySalary * daysWorked;

// Final Balance
const balance = Math.max(
  earnedSalary - deduction,
  0
);

grossPayroll += earnedSalary;

totalDeductions += deduction;

netPayroll += balance;

payrollRows.push({

  staff_id: employee.id,

  staff_name: employee.full_name,

  department: employee.department,

  position: employee.position,

  bank_name: employee.bank_name || "",

  account_name: employee.account_name || "",

  account_number: employee.account_number || "",

  basic_salary: Number(employee.salary || 0),

days_worked: daysWorked,

salary_earned: earnedSalary,

  total_deduction: deduction,

  balance_payable: balance,

  payroll_month: payrollMonth,

  payroll_year: payrollYear,

  payment_status: "Ready",

});

if (earnedSalary <= 0) {
  continue;
}

}

if(payrollRows.length>0){

await supabase

.from("payroll")

.insert(payrollRows);

await supabase

.from("payroll_history")

.insert({

payroll_month:payrollMonth,

payroll_year:payrollYear,

total_staff:staff.length,

gross_payroll:grossPayroll,

total_deductions:totalDeductions,

net_payroll:netPayroll,

});

}

alert("Payroll generated successfully.");

fetchData();

}

/* =====================================================
   PAY SALARY
===================================================== */

async function paySalary(id:number){

const { error } = await supabase
.from("payroll")
.update({
payment_status: "Paid"
})
.eq("id", id);

if(error){

alert(error.message);

return;

}

fetchData();

alert("Salary marked as paid.");

}

async function viewPayroll(month:string, year:number){

const { data, error } = await supabase
.from("payroll")
.select("*")
.eq("payroll_month", month)
.eq("payroll_year", year)
.order("staff_name");

if(error){

alert(error.message);

return;

}

setSelectedPayroll(data || []);

setShowPayrollModal(true);

}

/* =====================================================
   PAYROLL SUMMARY
===================================================== */

const grossPayroll=useMemo(()=>{

return payroll.reduce(

(sum,item)=>

sum+Number(item.basic_salary||0),

0

);

},[payroll]);

const totalDeductions=useMemo(()=>{

return payroll.reduce(

(sum,item)=>

sum+Number(item.total_deduction||0),

0

);

},[payroll]);

const netPayroll=useMemo(()=>{

return payroll.reduce(

(sum,item)=>

sum+Number(item.balance_payable||0),

0

);

},[payroll]);

const filteredPayroll=useMemo(()=>{

return payroll.filter((item)=>

item.staff_name

.toLowerCase()

.includes(search.toLowerCase())

);

},[payroll,search]);

/* =====================================================
   DOWNLOAD PAYROLL
===================================================== */

function downloadPayroll(){

const doc = new jsPDF();

const logo = new Image();
logo.src = "/images/iruka-logo.png";

logo.onload = () => {

  doc.addImage(logo, "PNG", 12, 8, 22, 22);

  // Everything else in your PDF goes here...

};

// Blue Header
doc.setFillColor(15, 23, 42);
doc.rect(0,0,210,35,"F");

// Company Name
doc.setTextColor(255,255,255);
doc.setFont("helvetica","bold");
doc.setFontSize(22);
doc.text("IRUKA INDUSTRIES LTD",105,16,{align:"center"});

// Report Title
doc.setFontSize(13);
doc.text("MONTHLY PAYROLL REPORT",105,25,{align:"center"});

// Reset color
doc.setTextColor(0,0,0);

// Month
doc.setFontSize(11);
doc.text(`Payroll Month : ${payrollMonth} ${payrollYear}`,14,45);
doc.text(`Generated : ${new Date().toLocaleDateString()}`,140,45);

autoTable(doc,{

startY:55,

theme:"grid",

headStyles:{
fillColor:[15,23,42],
textColor:[255,255,255],
fontStyle:"bold",
halign:"center"
},

alternateRowStyles:{
fillColor:[245,247,250]
},

styles:{
fontSize:9,
cellPadding:3,
valign:"middle"
},

columnStyles:{
0:{halign:"center"},
6:{halign:"right"},
7:{halign:"right"},
8:{halign:"right"},
9:{halign:"center"}
},

head:[[
"Staff ID",
"Staff",
"Department",
"Position",
"Bank",
"Account No",
"Salary",
"Deduction",
"Net Pay",
"Status"
]],

body:payroll.map(item=>[

item.staff_id,

item.staff_name,

item.department,

item.position,

item.bank_name,

item.account_number,

`₦${Number(item.basic_salary).toLocaleString()}`,

`₦${Number(item.total_deduction).toLocaleString()}`,

`₦${Number(item.balance_payable).toLocaleString()}`,

item.payment_status

])

});

const finalY=(doc as any).lastAutoTable.finalY+15;

doc.setFontSize(12);

doc.setDrawColor(200);

doc.roundedRect(14,finalY,182,28,2,2);

doc.setFont("helvetica","bold");

doc.text("Gross Payroll",18,finalY+8);
doc.text(`₦${grossPayroll.toLocaleString()}`,18,finalY+18);

doc.text("Total Deductions",78,finalY+8);
doc.text(`₦${totalDeductions.toLocaleString()}`,78,finalY+18);

doc.text("Net Payroll",150,finalY+8);
doc.text(`₦${netPayroll.toLocaleString()}`,150,finalY+18);

const signY = finalY + 50;

doc.line(18,signY,70,signY);
doc.text("Prepared By",25,signY+6);

doc.line(82,signY,134,signY);
doc.text("Finance Manager",88,signY+6);

doc.line(146,signY,198,signY);
doc.text("CEO Approval",154,signY+6);

doc.text("Date: ____________________",110,finalY+50);

doc.setFontSize(9);

doc.setTextColor(120);

doc.text(

"Generated automatically by IRUKA ERP System",

105,

290,

{align:"center"}

);

doc.save(`Payroll-${payrollMonth}-${payrollYear}.pdf`);

}

/* =====================================================
   PRINT PAYROLL
===================================================== */

function printPayroll(){

window.print();

}

/* =====================================================
   LOADING
===================================================== */

if(loading){

return(

<div className="min-h-screen flex items-center justify-center bg-slate-100">

<p className="text-xl font-semibold">

Loading Payroll...

</p>

</div>

);

}

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

Generate payroll directly from staff salaries and deductions.

</p>

</div>

<div className="grid grid-cols-2 gap-4">

<div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

<p className="text-xs uppercase tracking-widest text-slate-400">

Payroll Month

</p>

<h2 className="text-2xl font-bold text-white mt-2">

{payrollMonth} {payrollYear}

</h2>

</div>

<div className="rounded-2xl bg-white/10 backdrop-blur-lg p-5 border border-white/10">

<p className="text-xs uppercase tracking-widest text-slate-400">

Today's Date

</p>

<h2 className="text-xl font-bold text-white mt-2">

{new Date().toLocaleDateString()}

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

<h2 className="text-lg font-bold text-green-400 mt-2">

READY

</h2>

</div>

</div>

</div>

</div>

{/* =====================================================
    SUMMARY CARDS
===================================================== */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

<div className="rounded-3xl bg-white shadow-xl p-7">

<div className="flex items-center justify-between">

<Users className="text-blue-700" size={40}/>

<span className="text-sm font-semibold text-slate-500">

Employees

</span>

</div>

<h2 className="text-4xl font-black text-slate-900 mt-6">

{staff.length}

</h2>

</div>

<div className="rounded-3xl bg-white shadow-xl p-7">

<div className="flex items-center justify-between">

<Wallet className="text-green-600" size={40}/>

<span className="text-sm font-semibold text-slate-500">

Gross Payroll

</span>

</div>

<h2 className="text-3xl font-black text-green-700 mt-6">

₦{grossPayroll.toLocaleString()}

</h2>

</div>

<div className="rounded-3xl bg-white shadow-xl p-7">

<div className="flex items-center justify-between">

<Landmark className="text-red-600" size={40}/>

<span className="text-sm font-semibold text-slate-500">

Deductions

</span>

</div>

<h2 className="text-3xl font-black text-red-600 mt-6">

₦{totalDeductions.toLocaleString()}

</h2>

</div>

<div className="rounded-3xl bg-white shadow-xl p-7">

<div className="flex items-center justify-between">

<FileSpreadsheet className="text-amber-500" size={40}/>

<span className="text-sm font-semibold text-slate-500">

Balance Payable

</span>

</div>

<h2 className="text-3xl font-black text-slate-900 mt-6">

₦{netPayroll.toLocaleString()}

</h2>

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

Generate payroll, download the payroll sheet or print for payment.

</p>

</div>

<div className="flex flex-wrap gap-4">

<button

onClick={generatePayroll}

className="rounded-2xl bg-blue-900 hover:bg-blue-950 px-6 py-4 text-white font-bold transition"

>

Generate Payroll

</button>

<button

onClick={downloadPayroll}

className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-6 py-4 text-white font-bold transition flex items-center gap-2"

>

<Download size={18}/>

Download

</button>

<button

onClick={printPayroll}

className="rounded-2xl bg-slate-800 hover:bg-black px-6 py-4 text-white font-bold transition flex items-center gap-2"

>

<Printer size={18}/>

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

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search employee..."

className="w-full lg:w-96 rounded-2xl border-2 border-slate-200 px-5 py-4 outline-none focus:border-blue-800"

/>

<div className="flex items-center gap-2 text-slate-600">

<CalendarDays size={20}/>

<span className="font-semibold">

{payrollMonth} {payrollYear}

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

<th className="px-6 py-5 text-left">Staff ID</th>

<th className="px-6 py-5 text-left">Staff</th>

<th className="px-6 py-5 text-left">Department</th>

<th className="px-6 py-5 text-left">

Position

</th>

<th className="px-6 py-5 text-left">Bank</th>

<th className="px-6 py-5 text-left">Account No.</th>

<th className="px-6 py-5 text-right">Salary</th>

<th className="px-6 py-5 text-center">
Days Worked
</th>

<th className="px-6 py-5 text-right">
Salary Earned
</th>

<th className="px-6 py-5 text-right">Deduction</th>

<th className="px-6 py-5 text-right">Balance</th>

<th className="px-6 py-5 text-center">

Payment Date

</th>

<th className="px-6 py-5 text-center">Status</th>

</tr>

</thead>

<tbody>

{filteredPayroll.length===0 ? (

<tr>

<td
colSpan={8}
className="text-center py-16 text-slate-500"
>

No payroll generated.

</td>

</tr>

):(

filteredPayroll.map((item)=>(

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

{item.account_name}

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

{item.bank_name}

</td>

<td className="px-6 py-5 font-mono">

{item.account_number}

</td>

<td className="px-6 py-5 text-right font-semibold">

₦{Number(item.basic_salary).toLocaleString()}

</td>

<td className="px-6 py-5 text-center font-semibold">

{item.days_worked}

</td>

<td className="px-6 py-5 text-right font-semibold text-blue-700">

₦{Number(item.salary_earned).toLocaleString()}

</td>

<td className="px-6 py-5 text-right text-red-600 font-semibold">

₦{Number(item.total_deduction).toLocaleString()}

</td>

<td className="px-6 py-5 text-right text-green-700 font-bold">

₦{Number(item.balance_payable).toLocaleString()}

</td>

<td className="px-6 py-5 text-center">

{new Date(item.created_at).toLocaleDateString()}

</td>

<td className="px-6 py-5 text-center">

<div className="flex items-center justify-center gap-3">

<span
className={`rounded-full px-4 py-2 text-sm font-bold ${
item.payment_status==="Paid"
? "bg-green-100 text-green-700"
: "bg-yellow-100 text-yellow-700"
}`}
>

{item.payment_status}

</span>

{item.payment_status==="Ready" && (

<button
onClick={()=>paySalary(item.id)}
className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 text-xs font-bold"
>

Pay

</button>

)}

</div>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

{/* =====================================================
    PAYROLL HISTORY
===================================================== */}

<div className="rounded-3xl bg-white shadow-xl p-8">

<h2 className="text-3xl font-black text-slate-900 mb-6">

Payroll History

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

{history.length===0 ? (

<tr>

<td
colSpan={6}
className="text-center py-14 text-slate-500"
>

No payroll history found.

</td>

</tr>

):(

history.map((row)=>(

<tr
key={row.id}
className="border-b hover:bg-slate-50"
>

<td className="px-6 py-5 font-semibold">

{row.payroll_month} {row.payroll_year}

</td>

<td className="px-6 py-5 text-center">

{row.total_staff}

</td>

<td className="px-6 py-5 text-right">

₦{Number(row.gross_payroll).toLocaleString()}

</td>

<td className="px-6 py-5 text-right text-red-600">

₦{Number(row.total_deductions).toLocaleString()}

</td>

<td className="px-6 py-5 text-right text-green-700 font-bold">

₦{Number(row.net_payroll).toLocaleString()}

</td>

<td className="px-6 py-5 text-center">

<button
onClick={() => viewPayroll(row.payroll_month,row.payroll_year)}
className="rounded-xl bg-blue-900 hover:bg-blue-950 text-white px-5 py-2"
>

View

</button>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

</div>

{showPayrollModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-white rounded-3xl shadow-2xl w-[95%] max-w-6xl max-h-[85vh] overflow-y-auto p-8">

<div className="flex items-center justify-between mb-6">

<h2 className="text-3xl font-black">

Payroll Details

</h2>

<button
onClick={()=>setShowPayrollModal(false)}
className="bg-red-600 text-white px-5 py-2 rounded-xl"
>

Close

</button>

</div>

<table className="w-full">

<thead>

<tr className="bg-slate-900 text-white">

<th className="p-4 text-left">Staff</th>

<th className="p-4 text-left">Department</th>

<th className="p-4 text-right">Salary</th>

<th className="p-4 text-right">Deduction</th>

<th className="p-4 text-right">Net Pay</th>

<th className="p-4 text-center">Status</th>

</tr>

</thead>

<tbody>

{selectedPayroll.map((item)=>(

<tr key={item.id} className="border-b">

<td className="p-4">{item.staff_name}</td>

<td className="p-4">{item.department}</td>

<td className="p-4 text-right">

₦{Number(item.basic_salary).toLocaleString()}

</td>

<td className="p-4 text-right text-red-600">

₦{Number(item.total_deduction).toLocaleString()}

</td>

<td className="p-4 text-right text-green-700 font-bold">

₦{Number(item.balance_payable).toLocaleString()}

</td>

<td className="p-4 text-center">

<span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">

{item.payment_status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)}

</ProtectedRoute>

);

}