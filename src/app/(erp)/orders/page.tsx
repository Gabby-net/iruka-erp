"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  const [orderItems, setOrderItems] = useState([
    {
      bread_type: "",
      quantity: "",
    },
  ]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ============================================================
  // PRODUCTS
  // ============================================================

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("name");

    if (error) {
      console.error("Products error:", error);
      return;
    }

    setProducts(data || []);
  }

  // ============================================================
  // ORDERS
  // ============================================================

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .range(0, 9);

    if (error) {
      console.error("Orders error:", error);
      return;
    }

    setOrders(data || []);
  }

  // ============================================================
  // ORDER ITEMS
  // ============================================================

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

    if (updated.length === 0) {
      setOrderItems([
        {
          bread_type: "",
          quantity: "",
        },
      ]);
    } else {
      setOrderItems(updated);
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

  // ============================================================
  // PRODUCT HELPERS
  // ============================================================

  function getProductDetails(breadName: string) {
    return products.find(
      (product) => product.name === breadName
    );
  }

  function getBreadPrice(breadName: string) {
    const product = getProductDetails(breadName);

    return product
      ? Number(product.price || 0)
      : 0;
  }

  function calculateOrderTotal() {
    return orderItems.reduce(
      (sum, item) => {
        return (
          sum +
          getBreadPrice(item.bread_type) *
            Number(item.quantity || 0)
        );
      },
      0
    );
  }

  const totalAmount = calculateOrderTotal();

  // ============================================================
  // NORMALIZE PHONE
  // ============================================================

  function normalizePhone(value: string) {
    return String(value || "")
      .replace(/\s+/g, "")
      .trim();
  }

  // ============================================================
  // FIND OR CREATE BAKERY CUSTOMER
  // ============================================================

  async function findOrCreateBakeryCustomer() {
    const cleanName = customerName.trim();
    const cleanPhone = normalizePhone(phone);

    if (!cleanName) {
      throw new Error("Customer name is required.");
    }

    if (!cleanPhone) {
      throw new Error(
        "Customer phone number is required so the customer can be registered."
      );
    }

    // ----------------------------------------------------------
    // FIND EXISTING CUSTOMER BY PHONE
    // ----------------------------------------------------------

    const { data: existingCustomer, error: lookupError } =
      await supabase
        .from("customers")
        .select("*")
        .eq("phone", cleanPhone)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Customer lookup error:",
        lookupError
      );

      throw new Error(
        `Could not check customer record: ${lookupError.message}`
      );
    }

    // ----------------------------------------------------------
    // EXISTING CUSTOMER
    // ----------------------------------------------------------

    if (existingCustomer) {
      const customerUpdates: any = {};

      if (
        existingCustomer.full_name !==
        cleanName
      ) {
        customerUpdates.full_name =
          cleanName;
      }

      if (
        !existingCustomer.customer_type
      ) {
        customerUpdates.customer_type =
          "Bakery Customer";
      }

      if (
        !existingCustomer.status
      ) {
        customerUpdates.status =
          "Active";
      }

      if (
        Object.keys(customerUpdates).length > 0
      ) {
        const { error: updateError } =
          await supabase
            .from("customers")
            .update(customerUpdates)
            .eq(
              "id",
              existingCustomer.id
            );

        if (updateError) {
          throw new Error(
            `Could not update customer: ${updateError.message}`
          );
        }
      }

      return existingCustomer.id;
    }

    // ----------------------------------------------------------
    // NEW BAKERY CUSTOMER
    // ----------------------------------------------------------

    const { data: newCustomer, error: createError } =
      await supabase
        .from("customers")
        .insert({
          full_name: cleanName,
          phone: cleanPhone,
          password: null,
          is_verified: false,
          customer_type: "Bakery Customer",
          status: "Active",
        })
        .select()
        .single();

    if (createError || !newCustomer) {
      console.error(
        "Customer creation error:",
        createError
      );

      throw new Error(
        `Could not register customer: ${
          createError?.message ||
          "Unknown error"
        }`
      );
    }

    return newCustomer.id;
  }

  // ============================================================
  // SAVE ORDER
  // ============================================================

  async function saveOrder() {
    if (!customerName.trim()) {
      alert("Enter customer name.");
      return;
    }

    if (!phone.trim()) {
      alert(
        "Enter the customer's phone number.\n\nThe phone number is used to identify and maintain the customer's permanent bakery record."
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDATE ORDER ITEMS
    // ----------------------------------------------------------

    const validItems = orderItems.filter(
      (item) =>
        item.bread_type &&
        Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      alert(
        "Add at least one bread item with a valid quantity."
      );
      return;
    }

    // ----------------------------------------------------------
    // VALIDATE STOCK BEFORE CREATING ORDER
    // ----------------------------------------------------------

    for (const item of validItems) {
      const product = getProductDetails(
        item.bread_type
      );

      if (!product) {
        alert(
          `Product not found: ${item.bread_type}`
        );
        return;
      }

      if (
        Number(product.stock || 0) <
        Number(item.quantity)
      ) {
        alert(
          `${item.bread_type} does not have enough stock.\n\nAvailable: ${Number(
            product.stock || 0
          ).toLocaleString()}\nRequested: ${Number(
            item.quantity
          ).toLocaleString()}`
        );
        return;
      }
    }

    try {
      // --------------------------------------------------------
      // REGISTER / FIND CUSTOMER
      // --------------------------------------------------------

      const customerId =
        await findOrCreateBakeryCustomer();

      // --------------------------------------------------------
      // CREATE ORDER NUMBER
      // --------------------------------------------------------

      const orderNumber =
        `ORD-${Date.now()}`;

      // --------------------------------------------------------
      // CREATE ORDER
      // --------------------------------------------------------

      const {
        data: orderData,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,

          customer_name:
            customerName.trim(),

          customer:
            customerName.trim(),

          phone:
            normalizePhone(phone),

          order_number:
            orderNumber,

          payment_status:
            "Pending",

          order_status:
            "Pending",

          delivery_date:
            deliveryDate || null,

          notes:
            notes.trim() || null,

          total_amount:
            totalAmount,

          amount_paid: 0,

          balance:
            totalAmount,

          paid: 0,

          status:
            "Pending",

          order_source:
            "ERP",
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(
          orderError?.message ||
            "Could not create order."
        );
      }

      // --------------------------------------------------------
      // CREATE ORDER ITEMS
      // --------------------------------------------------------

      const itemsToInsert =
        validItems.map((item) => ({
          order_id:
            orderData.id,

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
            Number(item.quantity),
        }));

      const {
        error: itemsError,
      } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        // Roll back the order if items fail.
        await supabase
          .from("orders")
          .delete()
          .eq("id", orderData.id);

        throw new Error(
          `Could not create order items: ${itemsError.message}`
        );
      }

      // --------------------------------------------------------
      // RESET FORM
      // --------------------------------------------------------

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

      await fetchOrders();

      alert(
        `Customer order created successfully.\n\nCustomer: ${customerName}\nOrder: ${orderNumber}\nTotal: ₦${totalAmount.toLocaleString()}`
      );
    } catch (error: any) {
      console.error(
        "Save order error:",
        error
      );

      alert(
        error?.message ||
          "Something went wrong while creating the order."
      );
    }
  }

  // ============================================================
  // UPDATE PAYMENT
  // ============================================================

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

    if (
      newStatus === "Partially Paid"
    ) {
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
        alert(
          "Enter a valid payment amount."
        );
        return;
      }

      if (
        amountPaid >= totalAmount
      ) {
        alert(
          "Payment cannot be equal to or greater than the order total. Select Paid instead."
        );
        return;
      }
    }

    if (newStatus === "Paid") {
      amountPaid = totalAmount;
    }

    if (
      newStatus === "Pending" ||
      newStatus === "Refunded"
    ) {
      amountPaid = 0;
    }

    const balance = Math.max(
      totalAmount - amountPaid,
      0
    );

    // ----------------------------------------------------------
    // UPDATE ORDER
    // ----------------------------------------------------------

    const { error: orderError } =
      await supabase
        .from("orders")
        .update({
          payment_status:
            newStatus,

          amount_paid:
            amountPaid,

          balance:
            balance,

          paid:
            amountPaid,
        })
        .eq("id", order.id);

    if (orderError) {
      alert(orderError.message);
      return;
    }

    // ----------------------------------------------------------
    // FIND CUSTOMER USING CUSTOMER_ID FIRST
    // ----------------------------------------------------------

    let existingDebtor = null;

    const { data: debtorByCustomerId } =
      await supabase
        .from("debtors")
        .select("*")
        .eq(
          "customer_id",
          order.customer_id
        )
        .maybeSingle();

    existingDebtor =
      debtorByCustomerId;

    // ----------------------------------------------------------
    // FALLBACK TO PHONE FOR OLD RECORDS
    // ----------------------------------------------------------

    if (
      !existingDebtor &&
      order.phone
    ) {
      const { data: debtorByPhone } =
        await supabase
          .from("debtors")
          .select("*")
          .eq(
            "phone",
            order.phone
          )
          .maybeSingle();

      existingDebtor =
        debtorByPhone;
    }

    // ----------------------------------------------------------
    // CUSTOMER OWES MONEY
    // ----------------------------------------------------------

    if (
      newStatus ===
        "Partially Paid" &&
      balance > 0
    ) {
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

              customer_id:
                order.customer_id ||
                existingDebtor.customer_id,
            })
            .eq(
              "id",
              existingDebtor.id
            );

        if (error) {
          alert(error.message);
          return;
        }
      } else {
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

              customer_id:
                order.customer_id,
            });

        if (error) {
          alert(error.message);
          return;
        }
      }
    }

    // ----------------------------------------------------------
    // CUSTOMER FULLY PAID
    // ----------------------------------------------------------

    if (
      newStatus === "Paid"
    ) {
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

  // ============================================================
  // COMPLETE CUSTOMER ORDER
  // ============================================================

  async function completeCustomerOrder(
    order: any
  ) {
    if (
      order.order_status ===
      "Completed"
    ) {
      alert(
        "This order has already been completed."
      );
      return;
    }

    const {
      data: items,
      error,
    } = await supabase
      .from("order_items")
      .select("*")
      .eq(
        "order_id",
        order.id
      );

    if (error) {
      alert(error.message);
      return;
    }

    for (const item of items || []) {
      const {
        data: product,
        error: productError,
      } = await supabase
        .from("products")
        .select("*")
        .eq(
          "name",
          item.bread_type
        )
        .single();

      if (
        productError ||
        !product
      ) {
        alert(
          `Product not found: ${item.bread_type}`
        );
        return;
      }

      if (
        Number(product.stock || 0) <
        Number(item.quantity)
      ) {
        alert(
          `${item.bread_type} does not have enough stock.`
        );
        return;
      }

      const newStock =
        Number(product.stock || 0) -
        Number(item.quantity);

      const {
        error: updateError,
      } = await supabase
        .from("products")
        .update({
          stock: newStock,
        })
        .eq(
          "id",
          product.id
        );

      if (updateError) {
        alert(updateError.message);
        return;
      }

      // --------------------------------------------------------
      // CREATE SALES RECORD
      // --------------------------------------------------------

      const unitPrice =
        Number(product.price || 0);

      const quantity =
        Number(item.quantity);

      const total =
        unitPrice * quantity;

      const {
        error: salesError,
      } = await supabase
        .from("sales")
        .insert({
          customer_name:
            order.customer_name ||
            "Walk-in Customer",

          total_amount:
            total,

          payment: 0,

          balance:
            total,

          invoice_number:
            order.order_number ||
            `ORD-${order.id}`,

          product_id:
            product.id,

          product_name:
            product.name,

          quantity:
            quantity,

          unit_price:
            unitPrice,

          cashier:
            typeof window !==
            "undefined"
              ? localStorage.getItem(
                  "full_name"
                ) ||
                "System"
              : "System",

          payment_method:
            "Pending",

          payment_status:
            "Unpaid",

          amount_paid:
            0,

          customer_id:
            order.customer_id ||
            null,
        });

      if (salesError) {
        console.error(
          "Sales creation error:",
          salesError
        );
      }

      // --------------------------------------------------------
      // FINANCE TRANSACTION
      // --------------------------------------------------------

      const {
        error: financeError,
      } = await supabase
        .from(
          "finance_transactions"
        )
        .insert({
          transaction_type:
            "Sale",

          description:
            `${product.name} sold to ${
              order.customer_name ||
              "Walk-in Customer"
            }`,

          amount:
            total,

          category:
            "Sales Revenue",

          reference:
            order.order_number ||
            `ORD-${order.id}`,

          payment_method:
            "Pending",

          status:
            "Pending",

          created_by:
            typeof window !==
            "undefined"
              ? localStorage.getItem(
                  "full_name"
                ) ||
                "System"
              : "System",
        });

      if (financeError) {
        console.error(
          "Finance transaction error:",
          financeError
        );
      }
    }

    // ----------------------------------------------------------
    // COMPLETE ORDER
    // ----------------------------------------------------------

    const {
      error: orderError,
    } = await supabase
      .from("orders")
      .update({
        order_status:
          "Completed",

        completed_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        order.id
      );

    if (orderError) {
      alert(orderError.message);
      return;
    }

    await fetchOrders();

    alert(
      "Order completed successfully."
    );
  }

  // ============================================================
  // DELETE ORDER
  // ============================================================

  async function deleteOrder(
    order: any
  ) {
    const confirmed =
      confirm(
        "Delete this order?\n\nThe order will be removed and the customer's outstanding debt will be recalculated."
      );

    if (!confirmed) {
      return;
    }

    // ----------------------------------------------------------
    // DELETE ORDER
    // ----------------------------------------------------------

    const {
      error: deleteError,
    } = await supabase
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

    // ----------------------------------------------------------
    // FIND REMAINING OUTSTANDING ORDERS
    // ----------------------------------------------------------

    const {
      data: remainingOrders,
      error:
        remainingOrdersError,
    } = await supabase
      .from("orders")
      .select(
        "id, total_amount, amount_paid, payment_status, phone, customer_name, customer_id"
      )
      .eq(
        "customer_id",
        order.customer_id
      )
      .in(
        "payment_status",
        [
          "Partially Paid",
          "Pending",
        ]
      );

    if (
      remainingOrdersError
    ) {
      console.error(
        remainingOrdersError
      );
    }

    // ----------------------------------------------------------
    // CALCULATE REMAINING DEBT
    // ----------------------------------------------------------

    let remainingDebt = 0;

    for (
      const remainingOrder of
        remainingOrders || []
    ) {
      const total =
        Number(
          remainingOrder.total_amount ||
            0
        );

      const paid =
        Number(
          remainingOrder.amount_paid ||
            0
        );

      remainingDebt += Math.max(
        total - paid,
        0
      );
    }

    // ----------------------------------------------------------
    // FIND DEBTOR
    // ----------------------------------------------------------

    let debtor = null;

    if (order.customer_id) {
      const { data } =
        await supabase
          .from("debtors")
          .select("*")
          .eq(
            "customer_id",
            order.customer_id
          )
          .maybeSingle();

      debtor = data;
    }

    if (
      !debtor &&
      order.phone
    ) {
      const { data } =
        await supabase
          .from("debtors")
          .select("*")
          .eq(
            "phone",
            order.phone
          )
          .maybeSingle();

      debtor = data;
    }

    // ----------------------------------------------------------
    // UPDATE DEBTOR
    // ----------------------------------------------------------

    if (debtor) {
      if (
        remainingDebt > 0
      ) {
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
        await supabase
          .from("debtors")
          .delete()
          .eq(
            "id",
            debtor.id
          );
      }
    }

    await fetchOrders();

    alert(
      "Order deleted successfully."
    );
  }

  // ============================================================
  // RETURN UI
  // ============================================================

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
                    {new Date().toLocaleDateString(
                      "en-GB",
                      {
                        weekday:
                          "long",
                        day: "numeric",
                        month:
                          "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <p className="text-amber-300 mt-2 text-lg font-bold">
                    {new Date().toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
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
            <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-400" />
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400">
                    Pending
                  </p>
                  <h2 className="text-5xl font-black text-orange-400 mt-3">
                    {
                      orders.filter(
                        (o) =>
                          o.order_status ===
                          "Pending"
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
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-400" />
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400">
                    Ready
                  </p>
                  <h2 className="text-5xl font-black text-emerald-400 mt-3">
                    {
                      orders.filter(
                        (o) =>
                          o.order_status ===
                          "Ready"
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
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400">
                    Completed
                  </p>
                  <h2 className="text-5xl font-black text-purple-400 mt-3">
                    {
                      orders.filter(
                        (o) =>
                          o.order_status ===
                          "Completed"
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

            <span className="inline-flex items-center rounded-full bg-blue-500/20 text-blue-300 px-4 py-1 text-sm font-bold mb-3">
              📝 ORDER ENTRY
            </span>

            <h2 className="text-3xl font-black text-white">
              Create Customer Order
            </h2>

            <p className="text-slate-300 mt-2">
              Record customer orders and automatically maintain their bakery customer profile.
            </p>

          </div>

          <div className="bg-slate-900 p-8">

            {/* CUSTOMER */}

            <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-700">

              <div>

                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-3">
                  👤 CUSTOMER DETAILS
                </div>

                <h2 className="text-2xl font-black text-white">
                  Customer Information
                </h2>

                <p className="text-slate-400 mt-2">
                  Every customer who places an order is automatically registered as a Bakery Customer.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

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

            {/* BREAD ITEMS */}

            <div className="space-y-4">

              {orderItems.map(
                (item, index) => (
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
                        (product) => (
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
                      min="1"
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
                            alt={
                              item.bread_type
                            }
                            className="w-20 h-20 rounded-2xl object-contain bg-slate-900 p-2"
                          />

                          <div>

                            <p className="font-bold text-white">
                              {
                                item.bread_type
                              }
                            </p>

                            <p className="text-sm text-slate-400">
                              ₦
                              {getBreadPrice(
                                item.bread_type
                              ).toLocaleString()}
                            </p>

                            <p className="text-xs text-emerald-400 font-semibold">
                              Stock:{" "}
                              {Number(
                                getProductDetails(
                                  item.bread_type
                                )?.stock ||
                                  0
                              ).toLocaleString()}
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
              onClick={
                addOrderRow
              }
              className="mt-6 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition"
            >
              + Add Bread
            </button>

            {/* TOTAL */}

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
              onClick={
                saveOrder
              }
              className="mt-8 w-full bg-green-700 hover:bg-green-600 text-white p-5 rounded-2xl font-bold"
            >
              Save Customer Order
            </button>

          </div>

        </div>

        {/* ORDER HISTORY */}

        <div className="bg-slate-900 rounded-3xl shadow p-8">

          <h2 className="text-3xl font-black text-white mb-8">
            Customer Order History
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700 bg-slate-800">

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Order No
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Customer
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Phone
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Amount
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Payment
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Status
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Delivery
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Details
                  </th>

                  <th className="p-4 text-left text-slate-300 text-xs uppercase">
                    Delete
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map(
                  (order) => (
                    <tr
                      key={
                        order.id
                      }
                      className="border-b border-slate-800 hover:bg-slate-800/60"
                    >

                      <td className="p-4 text-slate-200">
                        {
                          order.order_number
                        }
                      </td>

                      <td className="p-4 text-slate-200 font-semibold">
                        {
                          order.customer_name
                        }
                      </td>

                      <td className="p-4 text-slate-200">
                        {order.phone}
                      </td>

                      <td className="p-4 font-bold text-green-400">
                        ₦
                        {Number(
                          order.total_amount ||
                            0
                        ).toLocaleString()}
                      </td>

                      {/* PAYMENT */}

                      <td className="p-4">

                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                            order.payment_status ===
                            "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.payment_status ===
                                "Partially Paid"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.payment_status ===
                                "Refunded"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {
                            order.payment_status
                          }
                        </div>

                        <select
                          value={
                            order.payment_status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateOrderPayment(
                              order,
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white px-4 py-2 text-sm"
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

<div className="mt-2 text-xs text-slate-400">

  Paid: ₦
  {Number(
    order.amount_paid || 0
  ).toLocaleString()}

  <br />

  Balance: ₦
  {order.payment_status === "Paid"
    ? "0"
    : Math.max(
        Number(
          order.total_amount || 0
        ) -
          Number(
            order.amount_paid || 0
          ),
        0
      ).toLocaleString()}

</div>

                      </td>

                      {/* ORDER STATUS */}

                      <td className="p-4">

                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                            order.order_status ===
                            "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.order_status ===
                                "Ready"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.order_status ===
                                "Preparing"
                              ? "bg-purple-100 text-purple-700"
                              : order.order_status ===
                                "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {
                            order.order_status
                          }
                        </div>

                        <select
                          value={
                            order.order_status ||
                            "Pending"
                          }
                          onChange={async (
                            e
                          ) => {

                            const newStatus =
                              e.target.value;

                            if (
                              newStatus ===
                              "Completed"
                            ) {
                              await completeCustomerOrder(
                                order
                              );
                              return;
                            }

                            const {
                              error,
                            } =
                              await supabase
                                .from(
                                  "orders"
                                )
                                .update({
                                  order_status:
                                    newStatus,
                                })
                                .eq(
                                  "id",
                                  order.id
                                );

                            if (
                              error
                            ) {
                              alert(
                                error.message
                              );
                              return;
                            }

                            if (
                              newStatus ===
                                "Confirmed" ||
                              newStatus ===
                                "Ready"
                            ) {

                              const title =
                                newStatus ===
                                "Confirmed"
                                  ? "Order Confirmed"
                                  : "Order Ready";

                              const message =
                                newStatus ===
                                "Confirmed"
                                  ? `Your order ${order.order_number} has been confirmed.`
                                  : `Good news! Your order ${order.order_number} is ready for pickup.`;

                              if (
                                order.customer_id
                              ) {
                                await supabase
                                  .from(
                                    "notifications"
                                  )
                                  .insert({
                                    customer_id:
                                      order.customer_id,

                                    title,

                                    message,

                                    is_read:
                                      false,
                                  });
                              }
                            }

                            await fetchOrders();
                          }}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 text-white px-4 py-2 text-sm"
                        >

                          <option>
                            Pending
                          </option>

                          <option>
                            Confirmed
                          </option>

                          <option>
                            Preparing
                          </option>

                          <option>
                            Baking
                          </option>

                          <option>
                            Packaging
                          </option>

                          <option>
                            Ready
                          </option>

                          <option>
                            Completed
                          </option>

                          <option>
                            Cancelled
                          </option>

                        </select>

                      </td>

                      <td className="p-4 text-slate-200">
                        {
                          order.delivery_date ||
                          "-"
                        }
                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            router.push(
                              `/orders/${order.id}`
                            )
                          }
                          className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
                        >
                          View
                        </button>

                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            deleteOrder(
                              order
                            )
                          }
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