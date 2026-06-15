"use client";

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {

  const [stock, setStock] =
    useState<Record<string, number>>({});

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [customer, setCustomer] =
    useState("");

  const [bread, setBread] =
    useState("Jumbo Iruka");

  const [quantity, setQuantity] =
    useState(1);

  const [price, setPrice] =
    useState(0);

  /* =========================
     FETCH ORDERS
  ========================== */

  useEffect(() => {

    fetchOrders();

    fetchStock();

  }, []);

  async function fetchOrders() {

    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {

      console.error(error);

    } else {

      setOrders(data || []);
    }

    setLoading(false);
  }

  async function fetchStock() {

    const { data, error } =
      await supabase
        .from("products")
        .select("name, stock");

    if (error) {

      console.error(error);
      return;
    }

    const stockMap: Record<string, number> = {};

    (data || []).forEach((item) => {

      stockMap[item.name] =
        item.stock || 0;

    });

    setStock(stockMap);

    if (!bread && data?.length) {

      setBread(data[0].name);

    }
  }

  /* =========================
     SAVE ORDER
  ========================== */
  /* =========================
     SAVE ORDER
  ========================== */

  async function saveOrder() {

    if (!customer) {

      alert("Enter customer name");

      return;
    }

    if (quantity <= 0) {

      alert("Invalid quantity");

      return;
    }

    /* GET REAL PRODUCT */

    const {
      data: productData,
    } = await supabase
      .from("products")
      .select("*")
      .eq("name", bread)
      .single();

    const availableStock =
      productData?.stock || 0;

    /* CHECK STOCK */

    if (quantity > availableStock) {

      alert(
        `Only ${availableStock} ${bread} available`
      );

      return;
    }

    const total =
      quantity * price;

    const newOrder = {

      customer,

      bread,

      quantity,

      price,

      total,

      status: "Completed",
    };

    const { error } =
      await supabase
        .from("orders")
        .insert([newOrder]);

    if (error) {

      console.error(error);

    } else {

      /* UPDATE REAL DATABASE STOCK */

      await supabase
        .from("products")
        .update({
          stock:
            availableStock - quantity,
        })
        .eq("name", bread);

      fetchOrders();
fetchStock();

      /* RESET */

      setCustomer("");

      setQuantity(1);

      setPrice(0);
    }
  }

  /* =========================
     TOTALS
  ========================== */

  const totalRevenue =
    orders.reduce(
      (sum, item) =>
        sum + Number(item.total),
      0
    );

  const totalOrders =
    orders.length;

  if (loading) {

    return (
      <div className="p-6">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-4xl font-bold">
          Orders & Sales
        </h1>

        <p className="text-gray-500 mt-2">
          Manage bakery customer orders
        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {totalOrders}

          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">

            ₦{totalRevenue.toLocaleString()}

          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Available Products
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">

            {Object.keys(stock).length}

          </h2>

        </div>

      </div>

      {/* ORDER FORM */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Create Order
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) =>
              setCustomer(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={bread}
            onChange={(e) =>
              setBread(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          >

            {Object.keys(stock).map(
              (breadName) => (

                <option
                  key={breadName}
                >
                  {breadName}
                </option>

              )
            )}

          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Unit Price"
            value={price}
            onChange={(e) =>
              setPrice(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-3 rounded-xl"
          />

        </div>

        {/* STOCK */}

        <div className="mt-4">

          <p className="text-sm text-gray-500">

            Available Stock:

            <span className="font-bold ml-2">

              {stock[bread] || 0}

            </span>

          </p>

        </div>

        <button
          onClick={saveOrder}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
        >

          Complete Order

        </button>

      </div>

      {/* SALES HISTORY */}

      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">

        <h2 className="text-2xl font-bold mb-6">
          Sales History
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-4">
                Customer
              </th>

              <th className="text-left py-4">
                Bread
              </th>

              <th className="text-left py-4">
                Qty
              </th>

              <th className="text-left py-4">
                Price
              </th>

              <th className="text-left py-4">
                Total
              </th>

              <th className="text-left py-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="py-4">
                  {item.customer}
                </td>

                <td>
                  {item.bread}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  ₦{item.price}
                </td>

                <td className="font-bold">
                  ₦{item.total}
                </td>

                <td>

                  <span className="text-green-600 font-bold">

                    {item.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}