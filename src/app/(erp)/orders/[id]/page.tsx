"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] =
    useState<any>(null);

  const [items, setItems] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchOrder();
    }
  }, [params?.id]);

  async function fetchOrder() {
    setLoading(true);

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();

    if (orderData) {
      setOrder(orderData);

      const {
        data: itemData,
      } = await supabase
        .from("order_items")
        .select("*")
        .eq(
          "order_id",
          orderData.id
        );

      setItems(itemData || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading Order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10">
        Order Not Found
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <button
        onClick={() =>
          router.push("/orders")
        }
        className="mb-6 bg-blue-950 text-white px-6 py-3 rounded-xl"
      >
        Back To Orders
      </button>

      <div className="bg-white rounded-3xl shadow p-8">

        <h1 className="text-4xl font-black text-blue-950 mb-8">
          Customer Order Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <h3 className="font-bold text-gray-500">
              Customer Name
            </h3>

            <p className="text-2xl font-bold">
              {order.customer_name}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-gray-500">
              Phone
            </h3>

            <p className="text-2xl font-bold">
              {order.phone || "-"}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-gray-500">
              Order Number
            </h3>

            <p className="text-xl font-bold">
              {order.order_number}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-gray-500">
              Delivery Date
            </h3>

            <p className="text-xl font-bold">
              {order.delivery_date || "-"}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-gray-500">
              Payment Status
            </h3>

            <p className="text-xl font-bold text-green-700">
              {order.payment_status}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-gray-500">
              Order Status
            </h3>

            <p className="text-xl font-bold text-orange-600">
              {order.order_status}
            </p>

          </div>

        </div>

        <div className="mt-8">

          <h3 className="font-bold text-gray-500">
            Notes
          </h3>

          <p className="mt-2">
            {order.notes || "No notes"}
          </p>

        </div>

      </div>

      <div className="bg-white rounded-3xl shadow p-8 mt-8">

        <h2 className="text-3xl font-bold mb-6">
          Ordered Products
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-4">
                Bread Type
              </th>

              <th className="text-left p-4">
                Quantity
              </th>

              <th className="text-left p-4">
                Unit Price
              </th>

              <th className="text-left p-4">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-4">
                  {item.bread_type}
                </td>

                <td className="p-4">
                  {item.quantity}
                </td>

                <td className="p-4">
                  ₦
                  {Number(
                    item.unit_price
                  ).toLocaleString()}
                </td>

                <td className="p-4 font-bold text-green-700">
                  ₦
                  {Number(
                    item.total_amount
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="mt-8 text-right">

          <h2 className="text-4xl font-black text-green-700">

            ₦
            {Number(
              order.total_amount || 0
            ).toLocaleString()}

          </h2>

        </div>

      </div>

    </div>
  );
}