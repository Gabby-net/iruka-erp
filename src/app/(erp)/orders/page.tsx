"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [deliveryDate, setDeliveryDate] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [orderItems, setOrderItems] =
    useState([
      {
        bread_type: "",
        quantity: "",
      },
    ]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("name");

    setProducts(data || []);
  }

async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .range(0, 9); // Latest 10 orders

  if (error) {
    console.error(error);
    return;
  }

  setOrders(data || []);
}

  function addOrderRow() {
    setOrderItems([
      ...orderItems,
      {
        bread_type: "",
        quantity: "",
      },
    ]);
  }

  function removeOrderRow(index: number) {
    const updated = [...orderItems];

    updated.splice(index, 1);

    setOrderItems(updated);

    if (updated.length === 0) {
      setOrderItems([
        {
          bread_type: "",
          quantity: "",
        },
      ]);
    }
  }

  function updateItem(
    index: number,
    field: string,
    value: string
  ) {
    const updated = [...orderItems];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setOrderItems(updated);
  }

  function getBreadPrice(
    breadName: string
  ) {
    const product = products.find(
      (p) => p.name === breadName
    );

    return product
      ? Number(product.price)
      : 0;
  }
  function getProductDetails(
  breadName: string
) {
  return products.find(
    (p) => p.name === breadName
  );
}

  function calculateOrderTotal() {
    return orderItems.reduce(
      (sum, item) => {
        return (
          sum +
          getBreadPrice(
            item.bread_type
          ) *
            Number(
              item.quantity || 0
            )
        );
      },
      0
    );
  }

  const totalAmount =
    calculateOrderTotal();

async function saveOrder() {
  if (!customerName) {
    alert("Enter customer name");
    return;
  }

  const orderNumber = `ORD-${Date.now()}`;

  const {
    data: orderData,
    error,
  } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: customerName,
        phone,
        order_number: orderNumber,
        payment_status: "Pending",
        order_status: "Pending",
        delivery_date: deliveryDate,
        notes,
        total_amount: totalAmount,
      },
    ])
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  const itemsToInsert = orderItems.map((item) => ({
    order_id: orderData.id,
    bread_type: item.bread_type,
    quantity: Number(item.quantity),
    unit_price: getBreadPrice(item.bread_type),
    total_amount:
      getBreadPrice(item.bread_type) *
      Number(item.quantity),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    alert(itemsError.message);
    return;
  }

  alert("Customer order created successfully");

  setCustomerName("");
  setPhone("");
  setDeliveryDate("");
  setNotes("");

  setOrderItems([
    {
      bread_type: "",
      quantity: "",
    },
  ]);

  fetchOrders();
}

async function updateOrderPayment(
  order: any,
  newStatus: string
) {
  const totalAmount = Number(
    order.total_amount || 0
  );

  let amountPaid = Number(
    order.amount_paid || 0
  );

  // PARTIALLY PAID
  if (newStatus === "Partially Paid") {

    const input = prompt(
      `Enter amount paid by ${order.customer_name}:`
    );

    if (input === null) {
      return;
    }

    amountPaid = Number(input);

    if (
      isNaN(amountPaid) ||
      amountPaid <= 0
    ) {
      alert("Enter a valid payment amount.");
      return;
    }

    if (amountPaid >= totalAmount) {
      alert(
        "Payment cannot be equal to or greater than the order total. Select Paid instead."
      );
      return;
    }
  }

  // PAID
  if (newStatus === "Paid") {
    amountPaid = totalAmount;
  }

  // PENDING / REFUNDED
  if (
    newStatus === "Pending" ||
    newStatus === "Refunded"
  ) {
    amountPaid = 0;
  }

  // CALCULATE REMAINING BALANCE
  const balance = Math.max(
    totalAmount - amountPaid,
    0
  );

  // UPDATE ORDER
  const { error: orderError } =
    await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        amount_paid: amountPaid,
      })
      .eq("id", order.id);

  if (orderError) {
    alert(orderError.message);
    return;
  }

  // FIND CUSTOMER IN DEBTORS
  const {
    data: existingDebtor,
    error: debtorError,
  } = await supabase
    .from("debtors")
    .select("*")
    .eq("phone", order.phone)
    .maybeSingle();

  if (debtorError) {
    console.error(
      "Debtor lookup error:",
      debtorError
    );
  }

  // CUSTOMER OWES MONEY
  if (
    newStatus === "Partially Paid" &&
    balance > 0
  ) {

    // CUSTOMER ALREADY EXISTS
    if (existingDebtor) {

      const { error } =
        await supabase
          .from("debtors")
          .update({
            customer_name:
              order.customer_name,
            phone:
              order.phone,
            balance:
              balance,
            status:
              "Owing",
          })
          .eq(
            "id",
            existingDebtor.id
          );

      if (error) {
        alert(error.message);
        return;
      }

    }

    // NEW CUSTOMER
    else {

      const { error } =
        await supabase
          .from("debtors")
          .insert({
            customer_name:
              order.customer_name,
            phone:
              order.phone,
            location:
              "",
            credit_limit:
              0,
            balance:
              balance,
            status:
              "Owing",
          });

      if (error) {
        alert(error.message);
        return;
      }
    }
  }

  // CUSTOMER PAID EVERYTHING
  if (newStatus === "Paid") {

    if (existingDebtor) {

      const { error } =
        await supabase
          .from("debtors")
          .update({
            balance: 0,
            status: "Paid",
          })
          .eq(
            "id",
            existingDebtor.id
          );

      if (error) {
        alert(error.message);
        return;
      }
    }
  }

  await fetchOrders();

  alert(
    `Payment updated successfully.\n\nAmount Paid: ₦${amountPaid.toLocaleString()}\nBalance: ₦${balance.toLocaleString()}`
  );
}

async function completeCustomerOrder(order: any) {

  if (order.order_status === "Completed") {
    alert("This order has already been completed.");
    return;
  }

  const { data: items, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  if (error) {
    alert(error.message);
    return;
  }

  for (const item of items || []) {

    const { data: product, error: productError } =
      await supabase
        .from("products")
        .select("*")
        .eq("name", item.bread_type)
        .single();

    if (productError || !product) {
      continue;
    }

    if (
      Number(product.stock) <
      Number(item.quantity)
    ) {
      alert(
        `${item.bread_type} does not have enough stock.`
      );
      return;
    }

    const newStock =
      Number(product.stock) -
      Number(item.quantity);

    const { error: updateError } =
      await supabase
        .from("products")
        .update({
          stock: newStock,
        })
        .eq("id", product.id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    // Create Sales Record

const unitPrice = Number(product.price || 0);

const quantity = Number(item.quantity);

const total = unitPrice * quantity;

await supabase
  .from("sales")
  .insert({
    customer_name:
      order.customer_name || "Walk-in Customer",

    total_amount: total,

    payment: 0,

    balance: total,

    invoice_number:
      order.order_number || `ORD-${order.id}`,

    product_id: product.id,

    product_name: product.name,

    quantity: quantity,

    unit_price: unitPrice,

    cashier:
      localStorage.getItem("full_name") ||
      "System",

    payment_method: "Pending",

    payment_status: "Unpaid",

    amount_paid: 0,
  });

  // Create Finance Transaction

await supabase
  .from("finance_transactions")
  .insert({
    transaction_type: "Sale",

    description:
      `${product.name} sold to ${
        order.customer_name || "Walk-in Customer"
      }`,

    amount: total,

    category: "Sales Revenue",

    reference:
      order.order_number || `ORD-${order.id}`,

    payment_method: "Pending",

    status: "Pending",

    created_by:
      localStorage.getItem("full_name") ||
      "System",
  });

  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      order_status: "Completed",
    })
    .eq("id", order.id);

  if (orderError) {
    alert(orderError.message);
    return;
  }

  fetchOrders();

  alert("Order completed successfully.");
}
    return (
<ProtectedRoute
  allowedRoles={[
    "admin",
    "cashier",
  ]}
>
  <div className="min-h-screen bg-slate-950 p-10">
        

        {/* HEADER */}

<div className="mb-10 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">

  <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-10">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-6">

        <div className="w-24 h-24 rounded-3xl bg-slate-900/10 backdrop-blur flex items-center justify-center border border-white/20">

          <Image
            src="/logo/nkiruka-logo.png"
            alt="NKIRUKA Logo"
            width={65}
            height={65}
          />

        </div>

        <div>

          <span className="inline-flex items-center rounded-full bg-amber-500/20 text-amber-300 px-4 py-1 text-sm font-bold mb-4">
            🛒 CUSTOMER ORDERS
          </span>

          <h1 className="text-5xl font-black text-white">
            Customer Orders
          </h1>

          <p className="text-slate-300 mt-3 text-lg">
            Manage customer bookings, monitor order progress and track payments.
          </p>

        </div>

      </div>

      <div className="mt-8 lg:mt-0 text-right">

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-5">

          <p className="text-slate-400 text-sm">
            Today
          </p>

          <p className="text-white font-bold text-xl">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <p className="text-amber-300 mt-2 text-lg font-bold">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

        </div>

      </div>

    </div>

  </div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">

    <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"/>

    <div className="p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-400">
            Total Orders
          </p>

          <h2 className="text-5xl font-black text-white mt-3">
            {orders.length}
          </h2>

        </div>

        <div className="text-5xl">
          📋
        </div>

      </div>

    </div>

  </div>

  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">

    <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-400"/>

    <div className="p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-400">
            Pending
          </p>

          <h2 className="text-5xl font-black text-orange-400 mt-3">
            {
              orders.filter(
                o => o.order_status === "Pending"
              ).length
            }
          </h2>

        </div>

        <div className="text-5xl">
          ⏳
        </div>

      </div>

    </div>

  </div>

  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">

    <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-400"/>

    <div className="p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-400">
            Ready
          </p>

          <h2 className="text-5xl font-black text-emerald-400 mt-3">
            {
              orders.filter(
                o => o.order_status === "Ready"
              ).length
            }
          </h2>

        </div>

        <div className="text-5xl">
          📦
        </div>

      </div>

    </div>

  </div>

  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">

    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"/>

    <div className="p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-400">
            Completed
          </p>

          <h2 className="text-5xl font-black text-purple-400 mt-3">
            {
              orders.filter(
                o => o.order_status === "Completed"
              ).length
            }
          </h2>

        </div>

        <div className="text-5xl">
          ✅
        </div>

      </div>

    </div>

  </div>

</div>

        {/* ORDER FORM */}

        <div className="mb-10 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">

  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-6 border-b border-slate-700">

    <div className="flex items-center justify-between">

      <div>

        <span className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-300 px-4 py-1 text-sm font-bold mb-3">
          📝 ORDER ENTRY
        </span>

        <h2 className="text-3xl font-black text-white">
          Create Customer Order
        </h2>

        <p className="text-slate-300 mt-2">
          Record customer orders and schedule bakery production.
        </p>

      </div>

      <div className="hidden lg:flex w-20 h-20 rounded-2xl bg-slate-900/10 items-center justify-center text-4xl">
        🛒
      </div>

    </div>

  </div>

  <div className="bg-slate-900 p-8"></div>

<div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-700">

  <div>

    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-3">
      👤 CUSTOMER DETAILS
    </div>

    <h2 className="text-2xl font-black text-white">
      Customer Information
    </h2>

    <p className="text-slate-400 mt-2">
      Enter the customer's personal information before adding bread items.
    </p>

  </div>

</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <input
              type="date"
              value={deliveryDate}
              onChange={(e) =>
                setDeliveryDate(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <input
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

          </div>

          {/* ORDER ITEMS */}

          <div className="space-y-4">

            {orderItems.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >

                  <select
                    value={
                      item.bread_type
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "bread_type",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >

                    <option value="">
                      Select Bread
                    </option>

                    {products.map(
                      (
                        product
                      ) => (

                        <option
                          key={
                            product.id
                          }
                          value={
                            product.name
                          }
                        >
                          {
                            product.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={
                      item.quantity
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

<div className="w-full rounded-2xl border border-slate-700 bg-slate-800 text-white px-5 py-4">

  {item.bread_type && (

    <div className="flex items-center gap-3">

      <img
        src={
          getProductDetails(
            item.bread_type
          )?.image_url
        }
        alt={item.bread_type}
        className="w-24 h-24 rounded-2xl object-contain bg-slate-900 p-2"
      />

      <div>

        <p className="font-bold text-white">
          {item.bread_type}
        </p>

        <p className="text-sm text-slate-400">
          ₦
          {getBreadPrice(
            item.bread_type
          ).toLocaleString()}
        </p>

        <p className="text-xs text-emerald-400 font-semibold">
          Stock:
          {
            getProductDetails(
              item.bread_type
            )?.stock
          }
        </p>

      </div>

    </div>

  )}

</div>

                  <button
                    type="button"
                    onClick={() =>
                      removeOrderRow(
                        index
                      )
                    }
                    className="rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all duration-300 hover:scale-105"
                  >
                    Remove
                  </button>

                </div>
              )
            )}

          </div>

          <button
            type="button"
            onClick={addOrderRow}
            className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition"
          >
            Add Bread
          </button>

          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-8 rounded-3xl shadow-sm">

            <h2 className="text-lg font-semibold text-gray-600">
  Order Total
</h2>

            <p className="text-6xl font-black text-green-700 mt-2">
              ₦
              {totalAmount.toLocaleString()}
            </p>

          </div>

          <button
            onClick={saveOrder}
            className="mt-8 w-full bg-green-700 hover:bg-green-600 text-white p-5 rounded-2xl font-bold"
          >
            Save Customer Order
          </button>

        </div>

        {/* ORDERS TABLE */}

        <div className="bg-slate-900 rounded-3xl shadow p-8">

<h2 className="text-3xl font-black text-white">
  Customer Order History
</h2>

          <div className="overflow-x-auto">

            <table className="w-full">

<thead>

  <tr className="border-b border-slate-700 bg-slate-800 text-slate-200">

<th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Order No
    </th>

<th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Customer
    </th>

  <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Phone
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Amount
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Payment
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Status
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Delivery
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Details
    </th>

    <th className="p-4 text-left text-slate-300 font-semibold uppercase tracking-wider text-xs">
      Delete
    </th>

  </tr>

</thead>

              <tbody>

                {orders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors duration-200"
                    >

                      <td className="p-4 text-slate-200">
                        {
                          order.order_number
                        }
                      </td>

                      <td className="p-4 text-slate-200">
                        {
                          order.customer_name
                        }
                      </td>

                      <td className="p-4 text-slate-200">
                        {order.phone}
                      </td>

                      <td className="p-4 font-bold text-green-700">
                        ₦
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4 text-slate-200">
<div
className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
  order.order_status === "Completed"
    ? "bg-green-100 text-green-700"

    : order.order_status === "Ready"
    ? "bg-emerald-100 text-emerald-700"

    : order.order_status === "Packaging"
    ? "bg-indigo-100 text-indigo-700"

    : order.order_status === "Baking"
    ? "bg-yellow-100 text-yellow-700"

    : order.order_status === "Preparing"
    ? "bg-purple-100 text-purple-700"

    : order.order_status === "Confirmed"
    ? "bg-blue-100 text-blue-700"

    : order.order_status === "Cancelled"
    ? "bg-red-100 text-red-700"

    : "bg-orange-100 text-orange-700"
}`}
>
  {order.payment_status}
</div>
<select
  value={
    order.payment_status || "Pending"
  }

  onChange={(e) =>
    updateOrderPayment(
      order,
      e.target.value
    )
  }

  className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
>

  <option value="Pending">
    Pending
  </option>

  <option value="Partially Paid">
    Partially Paid
  </option>

  <option value="Paid">
    Paid
  </option>

  <option value="Refunded">
    Refunded
  </option>

</select>

</td>

                     <td className="p-4 text-slate-200">
<div
  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
    order.order_status === "Completed"
      ? "bg-green-100 text-green-700"
      : order.order_status === "Ready"
      ? "bg-emerald-100 text-emerald-700"
      : order.order_status === "Preparing"
      ? "bg-purple-100 text-purple-700"
      : order.order_status === "Cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {order.order_status}
</div>
  <select
    value={
      order.order_status || "Pending"
    }

onChange={async (e) => {

  const newStatus = e.target.value;

  if (newStatus === "Completed") {
  await completeCustomerOrder(order);
  return;
}

  // Update order status
  await supabase
    .from("orders")
    .update({
      order_status: newStatus,
    })
    .eq("id", order.id);

  // Only notify for important updates
  if (
    newStatus === "Confirmed" ||
    newStatus === "Ready"
  ) {

    const title =
      newStatus === "Confirmed"
        ? "Order Confirmed"
        : "Order Ready";

    const message =
      newStatus === "Confirmed"
        ? `Your order ${order.order_number} has been confirmed.`
        : `Good news! Your order ${order.order_number} is ready for pickup.`;

    await supabase
      .from("notifications")
      .insert({
        customer_id: order.customer_id,
        title,
        message,
        is_read: false,
      });

  }

  fetchOrders();

}}

    className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
  >

<option>Pending</option>

<option>Confirmed</option>

<option>Preparing</option>

<option>Baking</option>

<option>Packaging</option>

<option>Ready</option>

<option>Completed</option>

<option>Cancelled</option>

  </select>

</td>

                      <td className="p-4 text-slate-200">
                        {
                          order.delivery_date
                        }
                      </td>

                      <td className="p-4 text-slate-200">

<button
  onClick={() =>
    router.push(
      `/orders/${order.id}`
    )
  }

  className="bg-blue-950 text-white px-4 py-2 rounded-lg"
>
  View
</button>

</td>

<td className="p-4 text-slate-200">

<button
  onClick={async () => {

    if (
      !confirm(
        "Delete this order?\n\nThis will also update the customer's outstanding debt."
      )
    ) {
      return;
    }

    // =====================================
    // DELETE ORDER
    // =====================================

    const { error: deleteError } =
      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

    if (deleteError) {
      alert(deleteError.message);
      return;
    }

    // =====================================
    // FIND CUSTOMER'S OTHER OUTSTANDING ORDERS
    // =====================================

    const {
      data: remainingOrders,
      error: remainingOrdersError,
    } = await supabase
      .from("orders")
      .select(
        "id, total_amount, amount_paid, payment_status, phone, customer_name"
      )
      .eq(
        "phone",
        order.phone
      )
      .in(
        "payment_status",
        [
          "Partially Paid",
          "Pending",
        ]
      );

    if (remainingOrdersError) {
      console.error(
        remainingOrdersError
      );
    }

    // =====================================
    // CALCULATE REMAINING DEBT
    // =====================================

    let remainingDebt = 0;

    for (
      const remainingOrder
      of remainingOrders || []
    ) {

      const total =
        Number(
          remainingOrder.total_amount || 0
        );

      const paid =
        Number(
          remainingOrder.amount_paid || 0
        );

      remainingDebt +=
        Math.max(
          total - paid,
          0
        );
    }

    // =====================================
    // FIND DEBTOR
    // =====================================

    const {
      data: debtor,
      error: debtorError,
    } = await supabase
      .from("debtors")
      .select("*")
      .eq(
        "phone",
        order.phone
      )
      .maybeSingle();

    if (debtorError) {
      console.error(
        debtorError
      );
    }

    // =====================================
    // UPDATE / REMOVE DEBTOR
    // =====================================

    if (debtor) {

      if (
        remainingDebt > 0
      ) {

        // CUSTOMER STILL OWES MONEY
        await supabase
          .from("debtors")
          .update({
            balance:
              remainingDebt,
            status:
              "Owing",
          })
          .eq(
            "id",
            debtor.id
          );

      } else {

        // NO OTHER DEBT
        await supabase
          .from("debtors")
          .delete()
          .eq(
            "id",
            debtor.id
          );
      }
    }

    // =====================================
    // REFRESH ORDERS
    // =====================================

    await fetchOrders();

    alert(
      "Order deleted successfully."
    );

  }}

  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
>
  Delete
</button>

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