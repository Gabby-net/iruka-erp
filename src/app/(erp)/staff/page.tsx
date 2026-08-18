"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import PremiumButton from "@/components/ui/PremiumButton";
import { toast } from "sonner";

const DEPARTMENTS = [
  "Production",
  "Sales",
  "Inventory",
  "Administration",
  "Dispatch",
  "Security",
  "Maintenance",
];
export default function StaffPage() {
  /* =====================================================
     STATES
  ====================================================== */

  const [staff, setStaff] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [searchStaff, setSearchStaff] = useState("");

  /* STAFF FORM */

  const [staffId, setStaffId] = useState("");

  const [fullName, setFullName] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [
    employmentStatus,
    setEmploymentStatus,
  ] = useState("Active");

  const [bankName, setBankName] =
  useState("");

const [accountName, setAccountName] =
  useState("");

const [accountNumber, setAccountNumber] =
  useState("");

  const [position, setPosition] =
  useState("");

const [gender, setGender] =
  useState("");

const [address, setAddress] =
  useState("");

const [
  emergencyContact,
  setEmergencyContact,
] = useState("");

const [dateJoined, setDateJoined] =
  useState("");

const [
  dateOfBirth,
  setDateOfBirth,
] = useState("");

const [photo, setPhoto] =
  useState<File | null>(null);

  const [savingStaff, setSavingStaff] = useState(false);

const [cv, setCv] =
  useState<File | null>(null);

  /* DEBT FORM */

  const [
    selectedStaff,
    setSelectedStaff,
  ] = useState("");

  const [
    debtReason,
    setDebtReason,
  ] = useState("");

  const [
    debtAmount,
    setDebtAmount,
  ] = useState("");
  

  /* =====================================================
   ERP ACCESS
===================================================== */

const [selectedMember, setSelectedMember] =
  useState<any>(null);

const [showErpModal, setShowErpModal] =
  useState(false);

const [erpEmail, setErpEmail] =
  useState("");

const [erpRole, setErpRole] =
  useState("production");

const [temporaryPassword, setTemporaryPassword] =
  useState("");

  /* =====================================================
   VIEW STAFF PROFILE
===================================================== */

const [showProfileModal, setShowProfileModal] =
  useState(false);

const [profileStaff, setProfileStaff] =
  useState<any>(null);

  /* =====================================================
   CHANGE STAFF STATUS
===================================================== */

const [showStatusModal, setShowStatusModal] = useState(false);

const [selectedStatusStaff, setSelectedStatusStaff] =
  useState<any>(null);

const [newEmploymentStatus, setNewEmploymentStatus] =
  useState("Active");

/* =====================================================
   EDIT STAFF
===================================================== */

const [showEditModal, setShowEditModal] =
  useState(false);

const [editingStaff, setEditingStaff] =
  useState<any>(null);  

  const [uploadingPhoto, setUploadingPhoto] =
  useState(false);

  /* =====================================================
     LOAD DATA
  ====================================================== */

  useEffect(() => {

    fetchData();

    generateStaffId();

  }, []);

  /* =====================================================
     GENERATE STAFF ID
  ====================================================== */

  function generateStaffId() {

    const random =
      Math.floor(
        1000 + Math.random() * 9000
      );

    setStaffId(`IRK-${random}`);

  }

  /* =====================================================
     FETCH DATA
  ====================================================== */

  async function fetchData() {

    const { data: staffData } =
      await supabase

        .from("staff")

        .select("*")

        .order("created_at", {
          ascending: false,
        });

    const { data: debtData } =
      await supabase

        .from("staff_debts")

        .select("*")

        .order("created_at", {
          ascending: false,
        });

    setStaff(staffData || []);

    setDebts(debtData || []);

  }

  /* =====================================================
     REGISTER STAFF
  ====================================================== */

  async function addStaff() {

console.log({
  fullName,
  phoneNumber,
  department,
  position,
  gender,
  address,
  emergencyContact,
  dateJoined,
  salary,
});

if (
  !fullName.trim() ||
  !phoneNumber.trim() ||
  !department.trim() ||
  !position.trim() ||
  !gender.trim() ||
  !address.trim() ||
  !emergencyContact.trim() ||
  !dateJoined.trim() ||
  !salary.trim()
) {
  toast.warning("Please fill all required fields.");
  return;
}

  // ==========================
  // Upload CV
  // ==========================

  let cvUrl: string |null = null;

  if (cv) {
    const cvName = `${Date.now()}-${cv.name}`;

    const { error: cvError } = await supabase.storage
      .from("staff-cv")
      .upload(cvName, cv);

    if (cvError) {
      toast.error(cvError.message);
      return;
    }

    const { data } = supabase.storage
      .from("staff-cv")
      .getPublicUrl(cvName);

    cvUrl = data.publicUrl;
  }

  // Upload Passport Photo
let photoUrl: string | null = null;

if (photo) {
  const photoName = `${Date.now()}-${photo.name}`;

  const { error: photoError } = await supabase.storage
    .from("staff-photos")
    .upload(photoName, photo);

  if (photoError) {
    alert(photoError.message);
    return;
  }

  const { data } = supabase.storage
    .from("staff-photos")
    .getPublicUrl(photoName);

  photoUrl = data.publicUrl;
}

const { error } = await supabase
  .from("staff")
  .insert([
    {
      staff_id: staffId,
      full_name: fullName,
      phone_number: phoneNumber,
      department,
      position,
      gender,
      address,
      emergency_contact: emergencyContact,
      date_joined: dateJoined,
      date_of_birth: dateOfBirth || null,
      salary: Number(salary),
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      employment_status: employmentStatus,
      photo_url: photoUrl,
      cv_url: cvUrl,
    },
  ]);


    if (error) {

      alert(error.message);

      return;

    }

toast.success("Staff registered successfully.");

    setFullName("");

    setPhoneNumber("");

    setDepartment("");

    setSalary("");

    setEmploymentStatus("Active");

    setBankName("");

setAccountName("");

setAccountNumber("");

    generateStaffId();

    fetchData();

    setPosition("");

setGender("");

setAddress("");

setEmergencyContact("");

setDateJoined("");

setDateOfBirth("");

setPhoto(null);

setCv(null);

  }

  /* =====================================================
     RECORD STAFF DEBT
  ====================================================== */

  async function addDebt() {

    if (
      !selectedStaff ||
      !debtReason ||
      !debtAmount
    ) {

      alert(
        "Please complete all fields."
      );

      return;

    }

    const today = new Date();

    const month =
      today.toLocaleString(
        "default",
        {
          month: "long",
        }
      );

    const year =
      today.getFullYear();

    const { error } =
      await supabase

        .from("staff_debts")

        .insert([
          {
            staff_name:
              selectedStaff,

            reason:
              debtReason,

            amount:
              Number(debtAmount),

            month,

            year,

            status: "Open",
          },
        ]);

    if (error) {

      alert(error.message);

      return;

    }

    setSelectedStaff("");

    setDebtReason("");

    setDebtAmount("");

    fetchData();

    alert(
      "Debt recorded successfully."
    );

  }

  /* =====================================================
     TOTAL CURRENT MONTH DEBT
  ====================================================== */

  function getTotalDebt(
    staffName: string
  ) {

    const today =
      new Date();

    const month =
      today.toLocaleString(
        "default",
        {
          month: "long",
        }
      );

    const year =
      today.getFullYear();

    return debts

      .filter(
        (debt) =>
          debt.staff_name ===
            staffName &&
          debt.month === month &&
          debt.year === year
      )

      .reduce(
        (sum, debt) =>
          sum +
          Number(debt.amount),
        0
      );

  }

  /* =====================================================
   CREATE ERP ACCOUNT
===================================================== */

async function createErpAccount() {

  if (
    !selectedMember ||
    !erpEmail ||
    !temporaryPassword
  ) {
    alert("Please complete all fields.");
    return;
  }

  try {

    const response = await fetch(
      "/api/staff/create-user",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          staffId:
            selectedMember.staff_id,
          fullName:
            selectedMember.full_name,
          email: erpEmail,
          password:
            temporaryPassword,
          role: erpRole,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {

      alert(result.error);

      return;

    }

    alert(
      "ERP account created successfully."
    );

    setShowErpModal(false);

    fetchData();

  } catch (error) {

    alert(
      "Something went wrong."
    );

  }

  }

async function updateEmploymentStatus() {

  if (!selectedStatusStaff) return;

  const { error } = await supabase
    .from("staff")
    .update({
      employment_status: newEmploymentStatus,
    })
    .eq("id", selectedStatusStaff.id);

if (error) {
  alert(error.message);
  return;
}

alert("Employment status updated successfully.");

setShowStatusModal(false);

setSelectedStatusStaff(null);

fetchData();

}   // <-- closes updateEmploymentStatus

async function updateStaff() {

  if (!editingStaff) return;

  const { error } = await supabase
    .from("staff")
    .update({
      full_name: editingStaff.full_name,
      phone_number: editingStaff.phone_number,
      department: editingStaff.department,
      position: editingStaff.position,
      salary: Number(editingStaff.salary),
      employment_status: editingStaff.employment_status,
    })
    .eq("id", editingStaff.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Staff updated successfully.");

  setShowEditModal(false);

  setEditingStaff(null);

  fetchData();

}

async function uploadStaffPhoto(file: File) {
  if (!editingStaff) return;

  try {
    setUploadingPhoto(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("staffId", editingStaff.id);

    const response = await fetch(
      "/api/staff/upload-photo",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    setEditingStaff({
      ...editingStaff,
      photo_url: result.photo_url,
    });

    fetchData();

    alert("Photo uploaded successfully.");

  } catch (error: any) {

    alert(error.message);

  } finally {

    setUploadingPhoto(false);

  }
}

/* =====================================================
   WORKING DURATION
===================================================== */

function getWorkingDuration(
  dateJoined: string
) {

  if (!dateJoined) return "-";

  const joined =
    new Date(dateJoined);

  const today =
    new Date();

  let years =
    today.getFullYear() -
    joined.getFullYear();

  let months =
    today.getMonth() -
    joined.getMonth();

  if (months < 0) {

    years--;

    months += 12;

  }

  if (years <= 0) {

    return `${months} Month${
      months !== 1 ? "s" : ""
    }`;

  }

  return `${years} Year${
    years !== 1 ? "s" : ""
  }, ${months} Month${
    months !== 1 ? "s" : ""
  }`;

}

  /* =====================================================
     KPIs
  ====================================================== */

  const totalStaff =
    staff.length;

  const totalSalary =
    staff.reduce(
      (sum, member) =>
        sum +
        Number(member.salary),
      0
    );

  const totalDebt =
    debts.reduce(
      (sum, debt) =>
        sum +
        Number(debt.amount),
      0
    );

  const totalDepartments =
    new Set(
      staff.map(
        (member) =>
          member.department
      )
    ).size;

  /* =====================================================
     PART 2 STARTS BELOW
  ====================================================== */

  return (
    <ProtectedRoute
  allowedRoles={[
    "admin",
    "accountant",
  ]}
>
  <div className="min-h-screen bg-gradient-to-br from-[#081028] via-[#0B1739] to-[#142850] p-10">

    {/* =====================================================
        PAGE HEADER
    ====================================================== */}

    <div className="flex items-center justify-between mb-10">

 <div className="mb-10 rounded-3xl border border-slate-700 bg-gradient-to-r from-[#0B1739] via-[#142850] to-[#1E3A8A] p-8 shadow-2xl">

  <div className="flex items-center justify-between">

    <div>

      <div className="inline-flex items-center rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-2 text-sm font-semibold text-blue-300 mb-4">
        👥 Human Resources Module
      </div>

      <h1 className="text-5xl font-black text-white tracking-tight">
        Staff Management
      </h1>

      <p className="mt-3 text-slate-300 text-lg">
        Register employees, manage payroll information, ERP access, employment status and staff records.
      </p>

    </div>

    <div className="hidden lg:flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-5xl">
      👨‍💼
    </div>

  </div>

</div>

    </div>

    {/* =====================================================
        KPI CARDS
    ====================================================== */}

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

      {/* TOTAL STAFF */}

      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-7 shadow-xl text-white">

        <p className="uppercase tracking-widest text-xs font-semibold text-blue-100">

          TOTAL STAFF

        </p>

        <h2 className="text-5xl font-black mt-4">

          {totalStaff}

        </h2>

      </div>

      {/* MONTHLY SALARY */}

      <div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-7 shadow-xl text-white">

        <p className="uppercase tracking-widest text-xs font-semibold text-green-100">

          MONTHLY SALARY BILL

        </p>

        <h2 className="text-5xl font-black mt-4">

          ₦{totalSalary.toLocaleString()}

        </h2>

      </div>

      {/* TOTAL DEBT */}

      <div className="rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-800 p-7 shadow-xl text-white">

        <p className="uppercase tracking-widest text-xs font-semibold text-red-100">

          TOTAL STAFF DEBT

        </p>

        <h2 className="text-5xl font-black mt-4">

          ₦{totalDebt.toLocaleString()}

        </h2>

      </div>

      {/* DEPARTMENTS */}

      <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-7 shadow-xl text-white">

        <p className="uppercase tracking-widest text-xs font-semibold text-yellow-100">

          DEPARTMENTS

        </p>

        <h2 className="text-5xl font-black mt-4">

          {totalDepartments}

        </h2>

      </div>

    </div>

    {/* =====================================================
        REGISTER STAFF
    ====================================================== */}

    <div className="rounded-3xl bg-[#111C44] border border-slate-700 shadow-2xl p-8 mb-8">

      <h2 className="text-3xl font-black text-white mb-8">

        Register New Staff

      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        <input
          type="text"
          value={staffId}
          readOnly
          className="rounded-2xl border-2 border-slate-200 bg-slate-100 p-4 font-bold text-blue-900"
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e)=>setFullName(e.target.value)}
          className="rounded-2xl border-2 border-slate-200 bg-white p-4 focus:border-blue-600 outline-none"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e)=>setPhoneNumber(e.target.value)}
          className="rounded-2xl border-2 border-slate-200 bg-white p-4 focus:border-blue-600 outline-none"
        />

        <select
  value={gender}
  onChange={(e) => setGender(e.target.value)}
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
>

  <option value="">

    Select Gender

  </option>

  <option value="Male">

    Male

  </option>

  <option value="Female">

    Female

  </option>

</select>

<input
  type="date"
  value={dateOfBirth}
  onChange={(e) =>
    setDateOfBirth(e.target.value)
  }
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

<input
  type="text"
  placeholder="Home Address"
  value={address}
  onChange={(e) =>
    setAddress(e.target.value)
  }
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

<input
  type="text"
  placeholder="Emergency Contact"
  value={emergencyContact}
  onChange={(e) =>
    setEmergencyContact(e.target.value)
  }
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

        <select
          value={department}
          onChange={(e)=>setDepartment(e.target.value)}
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        >

          <option value="">

            Select Department

          </option>

          {DEPARTMENTS.map((dept)=>(

            <option
              key={dept}
              value={dept}
            >

              {dept}

            </option>

          ))}

        </select>

        <input
  type="text"
  placeholder="Position / Job Title"
  value={position}
  onChange={(e) =>
    setPosition(e.target.value)
  }
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

<input
  type="date"
  value={dateJoined}
  onChange={(e) =>
    setDateJoined(e.target.value)
  }
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>


        <input
          type="number"
          placeholder="Monthly Salary"
          value={salary}
          onChange={(e)=>setSalary(e.target.value)}
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        />

        <input
  type="text"
  placeholder="Bank Name"
  value={bankName}
  onChange={(e)=>setBankName(e.target.value)}
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

<input
  type="text"
  placeholder="Account Name"
  value={accountName}
  onChange={(e)=>setAccountName(e.target.value)}
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

<input
  type="text"
  placeholder="Account Number"
  value={accountNumber}
  onChange={(e)=>setAccountNumber(e.target.value)}
  className="rounded-2xl border-2 border-slate-200 bg-white p-4"
/>

        <select
          value={employmentStatus}
          onChange={(e)=>
            setEmploymentStatus(
              e.target.value
            )
          }
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        >

          <option>

            Active

          </option>

          <option>

            Inactive

          </option>

        </select>

        <div>

  <label className="block mb-2 text-sm font-semibold text-slate-700">

    Passport Photo

  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setPhoto(
        e.target.files?.[0] || null
      )
    }
    className="w-full rounded-2xl border-2 border-slate-200 bg-white p-3"
  />

</div>

<div>

  <label className="block mb-2 text-sm font-semibold text-slate-700">

    Upload CV (PDF)

  </label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) =>
      setCv(
        e.target.files?.[0] || null
      )
    }
    className="w-full rounded-2xl border-2 border-slate-200 bg-white p-3"
  />

</div>

<button
  onClick={addStaff}
  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-900 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40"
>
  Register Staff
</button>

</div>

      </div>



    </div>
    

    {/* =====================================================
        STAFF DEBT
    ====================================================== */}

    <div className="rounded-3xl bg-[#111C44] border border-slate-700 shadow-2xl p-8 mb-10">

      <h2 className="text-3xl font-black text-white mb-8">

        Record Staff Debt / Advance

      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <select
          value={selectedStaff}
          onChange={(e)=>
            setSelectedStaff(
              e.target.value
            )
          }
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        >

          <option value="">

            Select Staff

          </option>

          {staff.map((member)=>(

            <option
              key={member.id}
              value={member.full_name}
            >

              {member.full_name}

            </option>

          ))}

        </select>

        <input
          type="text"
          placeholder="Reason"
          value={debtReason}
          onChange={(e)=>
            setDebtReason(
              e.target.value
            )
          }
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={debtAmount}
          onChange={(e)=>
            setDebtAmount(
              e.target.value
            )
          }
          className="rounded-2xl border-2 border-slate-200 bg-white p-4"
        />

        <button
          onClick={addDebt}
          className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold shadow-lg hover:scale-105 transition"
        >

          Record Debt

        </button>

      </div>
    </div>

    {/* =====================================================
    STAFF DIRECTORY
====================================================== */}

<div className="rounded-3xl bg-[#111C44] border border-slate-700 shadow-2xl p-8">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

    <div>

      <h2 className="text-3xl font-black text-white">

        Staff Directory

      </h2>

      <p className="text-slate-400 mt-1">

        All registered employees.

      </p>

    </div>

<input
  type="text"
  placeholder="Search staff..."
  value={searchStaff}
  onChange={(e) => setSearchStaff(e.target.value)}
  className="mt-5 md:mt-0 w-full md:w-72 rounded-2xl border border-slate-600 bg-[#0B1739] text-white placeholder:text-slate-400 p-4 outline-none focus:border-blue-500"
/>

  </div>

  <div className="overflow-x-auto rounded-2xl">

    <table className="w-full">

      <thead>

        <tr className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white">

          <th className="p-5 text-left">

  Photo

</th>

          <th className="p-5 text-left">

            Staff ID

          </th>

          <th className="p-5 text-left">

            Full Name

          </th>

          <th className="p-5 text-left">

            Phone

          </th>

          <th className="p-5 text-left">

            Department

          </th>

          <th className="p-5 text-left">

  Position

</th>

<th className="p-5 text-left">

  ERP Access

</th>

          <th className="p-5 text-left">

            Salary

          </th>

          <th className="p-5 text-left">

            Debt

          </th>

          <th className="p-5 text-left">

            Balance

          </th>

          <th className="p-5 text-left">

            Status

          </th>

          <th className="p-5 text-center">

            Action

          </th>

        </tr>

      </thead>

      <tbody>

        {staff
  .filter((member) => {
    const search = searchStaff.toLowerCase();

    return (
      member.full_name?.toLowerCase().includes(search) ||
      member.staff_id?.toLowerCase().includes(search) ||
      member.phone_number?.toLowerCase().includes(search) ||
      member.department?.toLowerCase().includes(search) ||
      member.position?.toLowerCase().includes(search)
    );
  })
  .map((member) => {

          const debt =
            getTotalDebt(
              member.full_name
            );

          const balance =
            Number(member.salary) -
            debt;

          return (

            <tr
              key={member.id}
              className="border-b border-slate-700 hover:bg-slate-800 transition"
            >
<td className="p-5">

  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">

    {member.photo_url ? (

      <img
        src={member.photo_url}
        alt={member.full_name}
        className="h-full w-full object-cover"
      />

    ) : (

      <span className="text-xl">👤</span>

    )}

  </div>

</td>
              <td className="p-5 font-bold text-blue-300">

                {member.staff_id}

              </td>

              <td className="p-5 font-semibold text-white">

                {member.full_name}

              </td>

<td className="p-5 text-slate-200">
  {member.phone_number}
</td>

              <td className="p-5 text-slate-200">

                <span className="rounded-full bg-blue-100 text-blue-900 px-4 py-2 text-sm font-semibold">

                  {member.department}

                </span>

              </td>

              <td className="p-5">

  {member.position || "-"}

</td>

<td className="p-5">

  {member.erp_user ? (

    <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">

      ✅ {member.erp_role}

    </span>

  ) : (

    <span className="rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-sm font-semibold">

      ❌ No ERP

    </span>

  )}

</td>

              <td className="p-5 font-bold text-green-700">

                ₦{Number(member.salary).toLocaleString()}

              </td>

              <td className="p-5 font-bold text-red-600">

                ₦{debt.toLocaleString()}

              </td>

              <td className="p-5 font-black text-blue-300">

                ₦{balance.toLocaleString()}

              </td>

<td className="p-5">

  <span
    className={`rounded-full px-4 py-2 text-xs font-bold ${
      member.employment_status === "Active"
        ? "bg-green-100 text-green-700"
        : member.employment_status === "On Leave"
        ? "bg-yellow-100 text-yellow-700"
        : member.employment_status === "Suspended"
        ? "bg-orange-100 text-orange-700"
        : member.employment_status === "Terminated"
        ? "bg-red-100 text-red-700"
        : member.employment_status === "Resigned"
        ? "bg-gray-100 text-gray-700"
        : member.employment_status === "Retired"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700"
    }`}
  >
    {member.employment_status || "Unknown"}
  </span>

</td>

<td className="p-5">

  <div className="flex flex-wrap gap-2 justify-center">

<button
  onClick={() => {

    setProfileStaff(member);

    setShowProfileModal(true);

  }}
  className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 font-semibold"
>

  View

</button>

    <button
    onClick={() => {
  setEditingStaff({ ...member });
  setShowEditModal(true);
}}
      className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 font-semibold"
    >

      Edit

    </button>

    <button
      onClick={() => {

        setSelectedMember(member);

        setErpEmail("");

        setErpRole("production");

        setTemporaryPassword("");

        setShowErpModal(true);

      }}
      className="rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 font-semibold"
    >

      ERP Access

    </button>

    <button
  onClick={() => {
    setSelectedStatusStaff(member);
    setNewEmploymentStatus(
      member.employment_status || "Active"
    );
    setShowStatusModal(true);
  }}
  className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 font-semibold"
>
  Status
</button>

  </div>

</td>

            </tr>

          );

        })}

      </tbody>

    </table>

  </div>

</div>

{/* =====================================================
    ERP ACCESS MODAL
===================================================== */}

{showErpModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

  <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">

    {/* HEADER */}

    <div className="bg-gradient-to-r from-indigo-800 to-blue-900 p-6">

      <h2 className="text-3xl font-black text-white">

        ERP Access Management

      </h2>

      <p className="text-blue-100 mt-1">

        Grant system access to an existing employee.

      </p>

    </div>

    {/* BODY */}

    <div className="p-8 space-y-6">

      <div>

        <label className="block text-sm font-bold text-slate-700 mb-2">

          Employee

        </label>

        <input
          value={selectedMember?.full_name || ""}
          readOnly
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-100 p-4"
        />

      </div>

      <div>

        <label className="block text-sm font-bold text-slate-700 mb-2">

          ERP Email

        </label>

        <input
          type="email"
          value={erpEmail}
          onChange={(e)=>setErpEmail(e.target.value)}
          placeholder="employee@iruka.com"
          className="w-full rounded-2xl border-2 border-slate-200 p-4 focus:border-indigo-600 outline-none"
        />

      </div>

      <div>

        <label className="block text-sm font-bold text-slate-700 mb-2">

          ERP Role

        </label>

        <select
          value={erpRole}
          onChange={(e)=>setErpRole(e.target.value)}
          className="w-full rounded-2xl border-2 border-slate-200 p-4"
        >

          <option value="production">
            Production
          </option>

          <option value="inventory officer">
            Inventory Officer
          </option>

          <option value="cashier">
            Cashier
          </option>

          <option value="accountant">
            Accountant
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

      </div>

      <div>

        <label className="block text-sm font-bold text-slate-700 mb-2">

          Temporary Password

        </label>

        <input
          type="text"
          value={temporaryPassword}
          onChange={(e)=>setTemporaryPassword(e.target.value)}
          placeholder="Temporary Password"
          className="w-full rounded-2xl border-2 border-slate-200 p-4 focus:border-indigo-600 outline-none"
        />

      </div>

    </div>

    {/* FOOTER */}

    <div className="flex justify-end gap-4 bg-slate-50 px-8 py-6">

      <button
        onClick={()=>setShowErpModal(false)}
        className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
      >

        Cancel

      </button>

<button
  onClick={createErpAccount}
  className="rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-900 px-8 py-3 font-bold text-white hover:scale-105 transition"
>

  Create ERP Account

</button>

    </div>

  </div>

</div>

)}

{/* =====================================================
    STAFF PROFILE MODAL
===================================================== */}

{showProfileModal && profileStaff && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 overflow-y-auto">

<div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden">

{/* HEADER */}

<div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8">

<div className="flex items-center gap-6">

<div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">

{profileStaff.photo_url ? (

<img
src={profileStaff.photo_url}
alt={profileStaff.full_name}
className="h-full w-full object-cover"
/>

) : (

<span className="text-5xl">

👤

</span>

)}

</div>

<div>

<h2 className="text-4xl font-black">

  {profileStaff.full_name}

</h2>

<p className="text-xl text-blue-200 mt-1 font-semibold">

  {profileStaff.position || "No Position Assigned"}

</p>

<div className="mt-4 flex flex-wrap gap-3">

  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
    profileStaff.employment_status === "Active"
      ? "bg-green-500"
      : profileStaff.employment_status === "On Leave"
      ? "bg-yellow-500"
      : profileStaff.employment_status === "Suspended"
      ? "bg-orange-500"
      : "bg-red-600"
  }`}>

    {profileStaff.employment_status}

  </span>

  <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-semibold">

    {profileStaff.department}

  </span>

</div>

<div className="grid grid-cols-2 gap-5 mt-6 text-blue-100">

  <div>

    <p className="text-xs uppercase">

      Staff ID

    </p>

    <p className="font-bold">

      {profileStaff.staff_id}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase">

      ERP Role

    </p>

    <p className="font-bold">

      {profileStaff.erp_role || "No ERP Access"}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase">

      Working Duration

    </p>

    <p className="font-bold">

      {getWorkingDuration(profileStaff.date_joined)}

    </p>

  </div>

  <div>

    <p className="text-xs uppercase">

      Salary

    </p>

    <p className="font-bold">

      ₦{Number(profileStaff.salary).toLocaleString()}

    </p>

  </div>

</div>

</div>

</div>

</div>

{/* BODY */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

{/* PERSONAL */}

<div>

<h3 className="text-2xl font-black text-slate-900 mb-5">

Personal Information

</h3>

<div className="space-y-4">

<p><strong>Gender:</strong> {profileStaff.gender || "-"}</p>

<p><strong>Date of Birth:</strong> {profileStaff.date_of_birth || "-"}</p>

<p><strong>Phone:</strong> {profileStaff.phone_number}</p>

<p><strong>Address:</strong> {profileStaff.address || "-"}</p>

<p><strong>Emergency Contact:</strong> {profileStaff.emergency_contact || "-"}</p>

</div>

</div>

{/* EMPLOYMENT */}

<div>

<h3 className="text-2xl font-black text-slate-900 mb-5">

Employment

</h3>

<div className="space-y-4">

<p><strong>Department:</strong> {profileStaff.department}</p>

<p><strong>Position:</strong> {profileStaff.position || "-"}</p>

<p><strong>Date Joined:</strong> {profileStaff.date_joined || "-"}</p>

<p>

<strong>Working Duration:</strong>

{" "}

{getWorkingDuration(
  profileStaff.date_joined
)}

</p>

<p>

<strong>Salary:</strong>

{" "}

₦{Number(profileStaff.salary).toLocaleString()}

</p>

<p>

<strong>Status:</strong>

{" "}

{profileStaff.employment_status}

</p>

</div>

</div>

{/* ERP */}

<div>

<h3 className="text-2xl font-black text-slate-900 mb-5">

ERP Access

</h3>

<div className="space-y-4">

<p>

<strong>ERP User:</strong>

{" "}

{profileStaff.erp_user ? "YES" : "NO"}

</p>

<p>

<strong>Role:</strong>

{" "}

{profileStaff.erp_role || "-"}

</p>

<p>

<strong>Email:</strong>

{" "}

{profileStaff.erp_email || "-"}

</p>

</div>

</div>

{/* DOCUMENTS */}

<div>

<h3 className="text-2xl font-black text-slate-900 mb-5">

Documents

</h3>

<div className="space-y-4">

{profileStaff.cv_url ? (

<a
href={profileStaff.cv_url}
target="_blank"
className="text-blue-700 font-semibold underline"
>

View CV

</a>

) : (

<p>No CV Uploaded</p>

)}

</div>

</div>

</div>

{/* FOOTER */}

<div className="flex justify-end gap-4 bg-slate-100 p-6">

<button

onClick={() => setShowProfileModal(false)}

className="rounded-xl bg-slate-300 px-6 py-3 font-bold"

>

Close

</button>

</div>

</div>

</div>

)}

{/* =====================================================
    CHANGE STATUS MODAL
===================================================== */}

{showStatusModal && selectedStatusStaff && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

  <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">

    <h2 className="text-2xl font-bold mb-6">

      Change Employment Status

    </h2>

    <div className="space-y-2">

  <label className="block text-sm font-semibold text-slate-700">

    Employment Status

  </label>

  <select
    value={newEmploymentStatus}
    onChange={(e) =>
      setNewEmploymentStatus(e.target.value)
    }
    className="w-full rounded-xl border border-slate-300 p-3"
  >
    <option value="Active">🟢 Active</option>

    <option value="On Leave">🟡 On Leave</option>

    <option value="Suspended">🟠 Suspended</option>

    <option value="Terminated">🔴 Terminated</option>

    <option value="Resigned">⚫ Resigned</option>

    <option value="Retired">🔵 Retired</option>

  </select>

</div>

<div className="mt-8 flex justify-end gap-3">

  <button
    onClick={() => {
      setShowStatusModal(false);
      setSelectedStatusStaff(null);
    }}
    className="rounded-xl bg-slate-300 hover:bg-slate-400 px-5 py-3 font-semibold"
  >
    Cancel
  </button>

  <button
    onClick={updateEmploymentStatus}
    className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 font-semibold"
  >
    Save Changes
  </button>

</div>

  </div>

</div>

)}

{/* =====================================================
    EDIT STAFF MODAL
===================================================== */}

{showEditModal && editingStaff && (

<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">

  <div className="relative w-full max-w-5xl rounded-[28px] bg-white shadow-[0_35px_90px_rgba(0,0,0,0.25)] overflow-hidden">

    {/* ================= HEADER ================= */}

    <div className="flex items-center justify-between border-b border-slate-200 px-10 py-7">

      <div className="flex items-center gap-5">

        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">

          👤

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-900">

            Edit Staff

          </h2>

          <p className="text-slate-400 mt-1">

            Update employee information.

          </p>

        </div>

      </div>

      <button
        onClick={()=>{
          setShowEditModal(false);
          setEditingStaff(null);
        }}
        className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-100 text-xl"
      >
        ✕
      </button>

    </div>

    {/* ================= BODY ================= */}

    <div className="px-10 py-8">

      {/* PHOTO */}

      <div className="flex flex-col items-center mb-10">

        <img
          src={
            editingStaff.photo_url ||
            "https://placehold.co/180x180?text=Photo"
          }
          alt="Staff"
          className="w-40 h-40 rounded-full object-cover border-[5px] border-slate-200 shadow-sm"
        />

        <label className="mt-5">

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e)=>{
              if(e.target.files?.[0]){
                uploadStaffPhoto(e.target.files[0]);
              }
            }}
          />

          <span className="cursor-pointer rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 font-semibold">

            {uploadingPhoto ? "Uploading..." : "Choose Photo"}

          </span>

        </label>

      </div>

      {/* FORM */}

      <div className="grid grid-cols-2 gap-x-10 gap-y-8">

        {/* FULL NAME */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Full Name

          </label>

          <input
            type="text"
            value={editingStaff.full_name}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                full_name:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          />

        </div>

        {/* PHONE */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Phone Number

          </label>

          <input
            type="text"
            value={editingStaff.phone_number}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                phone_number:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          />

        </div>

        {/* DEPARTMENT */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Department

          </label>

          <input
            type="text"
            value={editingStaff.department || ""}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                department:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          />

        </div>

        {/* POSITION */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Position

          </label>

          <input
            type="text"
            value={editingStaff.position || ""}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                position:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          />

        </div>

                {/* SALARY */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Salary

          </label>

          <input
            type="number"
            value={editingStaff.salary || ""}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                salary:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          />

        </div>

        {/* EMPLOYMENT STATUS */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Employment Status

          </label>

          <select
            value={editingStaff.employment_status || "Active"}
            onChange={(e)=>
              setEditingStaff({
                ...editingStaff,
                employment_status:e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="Active">🟢 Active</option>
            <option value="On Leave">🟡 On Leave</option>
            <option value="Suspended">🟠 Suspended</option>
            <option value="Terminated">🔴 Terminated</option>
            <option value="Resigned">⚫ Resigned</option>
            <option value="Retired">🔵 Retired</option>
          </select>

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-12 border-t border-slate-200 pt-8 flex items-center justify-end gap-4">

        <button
          onClick={()=>{
            setShowEditModal(false);
            setEditingStaff(null);
          }}
          className="px-8 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold transition"
        >

          Cancel

        </button>

        <button
          onClick={updateStaff}
          className="px-10 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-lg transition"
        >

          💾 Save Changes

        </button>

      </div>

    </div>

  </div>

</div>

)}

</ProtectedRoute>

);

}