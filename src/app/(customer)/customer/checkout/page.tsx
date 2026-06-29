"use client";

import { useState } from "react";
import { useCustomer } from "@/context/CustomerContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import PrimaryButton from "@/components/customer-app/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { customer } = useCustomer();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [deliveryMethod, setDeliveryMethod] =
    useState("pickup");

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const deliveryFee =
    deliveryMethod === "delivery"
      ? 1500
      : 0;

  const grandTotal =
    cartTotal + deliveryFee;

  async function handleCheckout() {
    if (!customerName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (
      deliveryMethod === "delivery" &&
      !deliveryAddress.trim()
    ) {
      alert("Please enter your delivery address.");
      return;
    }

    try {
      setLoading(true);

      const order =
await createOrder({
  customerId: customer?.id || "",
  customerName,
  phone,
  deliveryMethod,
  deliveryAddress,
  cart,
  total: grandTotal,
});

      console.log("ORDER:", order);

      clearCart();

      alert("Order created successfully.");

      router.push("/customer/order-success");

    } catch (error) {
      console.error(error);
      alert("Unable to create order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] pb-40">

      {/* Header */}

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="text-white" />
          </button>

          <h1 className="text-white text-3xl font-black">
            Checkout
          </h1>

        </div>

      </div>

      <div className="p-5 space-y-6">

        {/* Customer Information */}

        <div className="bg-white rounded-3xl p-5 shadow">

          <h2 className="text-xl font-bold mb-5">
            Customer Information
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className="w-full border rounded-xl p-4 mb-4"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full border rounded-xl p-4"
          />

        </div>

        {/* Delivery */}

        <div className="bg-white rounded-3xl p-5 shadow">

          <h2 className="text-xl font-bold mb-5">
            Delivery Method
          </h2>

          <label className="flex items-center gap-3 mb-4">

            <input
              type="radio"
              checked={deliveryMethod === "pickup"}
              onChange={() =>
                setDeliveryMethod("pickup")
              }
            />

            Pickup

          </label>

          <label className="flex items-center gap-3">

            <input
              type="radio"
              checked={deliveryMethod === "delivery"}
              onChange={() =>
                setDeliveryMethod("delivery")
              }
            />

            Home Delivery

          </label>

          {deliveryMethod === "delivery" && (

            <textarea
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(e.target.value)
              }
              placeholder="Delivery Address"
              rows={4}
              className="mt-5 w-full border rounded-xl p-4"
            />

          )}

        </div>

                {/* Order Summary */}

        <div className="bg-white rounded-3xl p-5 shadow">

          <h2 className="text-xl font-bold mb-5">
            Order Summary
          </h2>

          {cart.length === 0 ? (

            <p className="text-gray-500">
              Your cart is empty.
            </p>

          ) : (

            cart.map((item) => (

              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div>

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ₦{item.price} × {item.quantity}
                  </p>

                </div>

                <p className="font-bold">
                  ₦{item.price * item.quantity}
                </p>

              </div>

            ))

          )}

          <hr className="my-5" />

          <div className="flex justify-between mb-3">

            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-semibold">
              ₦{cartTotal}
            </span>

          </div>

          <div className="flex justify-between mb-3">

            <span className="text-gray-600">
              Delivery Fee
            </span>

            <span className="font-semibold">
              ₦{deliveryFee}
            </span>

          </div>

          <hr className="my-5" />

          <div className="flex justify-between items-center">

            <span className="text-2xl font-black">
              Grand Total
            </span>

            <span className="text-3xl font-black text-[#B45309]">
              ₦{grandTotal}
            </span>

          </div>

        </div>

      </div>

      {/* Bottom Button */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl p-5">

        <PrimaryButton
          title={
            loading
              ? "Creating Order..."
              : "Continue To Payment"
          }
          onClick={handleCheckout}
        />

      </div>

    </main>
  );
}