"use client";

import { useEffect, useState } from "react";
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
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

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

    const orderNumber =
      `ORD-${Date.now()}`;

    const {
      data: orderData,
      error,
    } = await supabase
      .from("orders")
      .insert([
        {
          customer_name:
            customerName,
          phone,
          order_number:
            orderNumber,
          payment_status:
            "Pending",
          order_status:
            "Pending",
          delivery_date:
            deliveryDate,
          notes,
          total_amount:
            totalAmount,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    const itemsToInsert =
      orderItems.map((item) => ({
        order_id: orderData.id,
        bread_type:
          item.bread_type,
        quantity:
          Number(item.quantity),
        unit_price:
          getBreadPrice(
            item.bread_type
          ),
        total_amount:
          getBreadPrice(
            item.bread_type
          ) *
          Number(
            item.quantity
          ),
      }));

    await supabase
      .from("order_items")
      .insert(itemsToInsert);

    alert(
      "Customer order created successfully"
    );

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
    return (
    <ProtectedRoute
      allowedRoles={[
        "admin",
        "cashier",
      ]}
    >
      <div className="p-10 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-blue-950">
            Customer Orders
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Manage customer bookings, bulk orders and future deliveries
          </p>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-500">
              Total Orders
            </h2>

            <p className="text-5xl font-black text-blue-950 mt-4">
              {orders.length}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-500">
              Pending
            </h2>

            <p className="text-5xl font-black text-orange-600 mt-4">
              {
                orders.filter(
                  (o) =>
                    o.order_status ===
                    "Pending"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-500">
              Ready
            </h2>

            <p className="text-5xl font-black text-green-700 mt-4">
              {
                orders.filter(
                  (o) =>
                    o.order_status ===
                    "Ready"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-500">
              Delivered
            </h2>

            <p className="text-5xl font-black text-purple-700 mt-4">
              {
                orders.filter(
                  (o) =>
                    o.order_status ===
                    "Delivered"
                ).length
              }
            </p>
          </div>

        </div>

        {/* ORDER FORM */}

        <div className="bg-white rounded-3xl shadow p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Create Customer Order
          </h2>

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
              className="border-2 p-4 rounded-2xl"
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
              className="border-2 p-4 rounded-2xl"
            />

            <input
              type="date"
              value={deliveryDate}
              onChange={(e) =>
                setDeliveryDate(
                  e.target.value
                )
              }
              className="border-2 p-4 rounded-2xl"
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
              className="border-2 p-4 rounded-2xl"
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
                    className="border-2 p-4 rounded-2xl"
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
                    className="border-2 p-4 rounded-2xl"
                  />

                  <div className="border-2 p-4 rounded-2xl bg-gray-50 font-bold text-green-700">
                    ₦
                    {(
                      getBreadPrice(
                        item.bread_type
                      ) *
                      Number(
                        item.quantity || 0
                      )
                    ).toLocaleString()}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeOrderRow(
                        index
                      )
                    }
                    className="bg-red-600 text-white rounded-2xl"
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
            className="mt-6 bg-blue-950 text-white px-6 py-3 rounded-2xl"
          >
            Add Bread
          </button>

          <div className="mt-8 bg-gray-100 p-6 rounded-2xl">

            <h2 className="text-xl font-bold">
              Order Total
            </h2>

            <p className="text-5xl font-black text-green-700 mt-3">
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

        <div className="bg-white rounded-3xl shadow p-8">

          <h2 className="text-3xl font-bold mb-6">
            Customer Orders
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

<thead>

  <tr className="border-b bg-gray-50">

    <th className="p-4 text-left">
      Order No
    </th>

    <th className="p-4 text-left">
      Customer
    </th>

    <th className="p-4 text-left">
      Phone
    </th>

    <th className="p-4 text-left">
      Amount
    </th>

    <th className="p-4 text-left">
      Payment
    </th>

    <th className="p-4 text-left">
      Status
    </th>

    <th className="p-4 text-left">
      Delivery
    </th>

    <th className="p-4 text-left">
      Details
    </th>

    <th className="p-4 text-left">
      Delete
    </th>

  </tr>

</thead>

              <tbody>

                {orders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      className="border-b"
                    >

                      <td className="p-4">
                        {
                          order.order_number
                        }
                      </td>

                      <td className="p-4">
                        {
                          order.customer_name
                        }
                      </td>

                      <td className="p-4">
                        {order.phone}
                      </td>

                      <td className="p-4 font-bold text-green-700">
                        ₦
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4">

  <select
    value={
      order.payment_status || "Pending"
    }

    onChange={async (e) => {

      await supabase
        .from("orders")
        .update({
          payment_status:
            e.target.value,
        })
        .eq(
          "id",
          order.id
        );

      fetchOrders();
    }}

    className="border rounded-lg px-3 py-2"
  >

    <option>
      Pending
    </option>

    <option>
      Partially Paid
    </option>

    <option>
      Paid
    </option>

    <option>
      Refunded
    </option>

  </select>

</td>

                     <td className="p-4">

  <select
    value={
      order.order_status || "Pending"
    }

    onChange={async (e) => {

      await supabase
        .from("orders")
        .update({
          order_status:
            e.target.value,
        })
        .eq(
          "id",
          order.id
        );

      fetchOrders();
    }}

    className="border rounded-lg px-3 py-2"
  >

    <option>
      Pending
    </option>

    <option>
      Preparing
    </option>

    <option>
      Ready
    </option>

    <option>
      Delivered
    </option>

    <option>
      Cancelled
    </option>

  </select>

</td>

                      <td className="p-4">
                        {
                          order.delivery_date
                        }
                      </td>

                      <td className="p-4">

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

<td className="p-4">

  <button
    onClick={async () => {

      if (
        !confirm(
          "Delete this order?"
        )
      )
        return;

      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id
        );

      fetchOrders();
    }}

    className="bg-red-600 text-white px-4 py-2 rounded-lg"
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