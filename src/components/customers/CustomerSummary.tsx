interface CustomerSummaryProps {

  customers:any[];

}

export default function CustomerSummary({

  customers,

}:CustomerSummaryProps){

const totalCustomers =
customers.length;

return(

<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

Total Customers

</p>

<h2 className="text-4xl font-black mt-3 text-[#071028]">

{totalCustomers}

</h2>

</div>

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

Active Customers

</p>

<h2 className="text-4xl font-black mt-3 text-green-600">

0

</h2>

</div>

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

New Customers

</p>

<h2 className="text-4xl font-black mt-3 text-blue-600">

0

</h2>

</div>

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

Returning

</p>

<h2 className="text-4xl font-black mt-3 text-orange-500">

0

</h2>

</div>

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

Lifetime Revenue

</p>

<h2 className="text-2xl font-black mt-3 text-[#071028]">

₦0

</h2>

</div>

<div className="bg-white rounded-3xl shadow p-6">

<p className="text-gray-500">

Average Order

</p>

<h2 className="text-2xl font-black mt-3 text-[#071028]">

₦0

</h2>

</div>

</div>

);

}