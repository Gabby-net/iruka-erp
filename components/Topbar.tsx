"use client";

export default function Topbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center rounded-lg mb-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bakery ERP
        </h1>

        <p className="text-gray-500 text-sm">
          Bakery Operations Intelligence Center
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">
            CEO Admin
          </p>

          <p className="text-sm text-gray-500">
            administrator
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
          A
        </div>
      </div>
    </div>
  );
}