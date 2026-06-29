"use client";

import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import PrimaryButton from "@/components/customer-app/PrimaryButton";

export default function CartPage() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  console.log("CART:", cart);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center px-6">

        <ShoppingCart
          size={80}
          className="text-gray-300"
        />

        <h1 className="text-3xl font-black mt-6">
          Your Cart is Empty
        </h1>

        <p className="text-gray-500 mt-2 text-center">
          Browse our freshly baked bread and add your favourite products.
        </p>

        <div className="mt-8 w-full max-w-xs">
          <PrimaryButton
            title="Continue Shopping"
            href="/customer/home"
          />
        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] pb-40">

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <h1 className="text-white text-3xl font-black">
          My Cart
        </h1>

        <p className="text-gray-300 mt-2">
          {cart.length} item(s)
        </p>

      </div>

      <div className="p-5 space-y-5">

        {cart.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-md p-4 flex gap-4"
          >

            <img
              src={item.image_url}
              alt={item.name}
              className="w-24 h-24 object-contain bg-[#F8F8F8] rounded-2xl"
            />

            <div className="flex-1">

              <h2 className="font-black text-lg">
                {item.name}
              </h2>

              <p className="text-[#B45309] text-xl font-black mt-1">
                ₦{item.price}
              </p>

              <div className="flex items-center gap-3 mt-4">

                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <Minus size={18} />
                </button>

                <span className="font-bold text-lg">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="w-9 h-9 rounded-full bg-[#B45309] text-white flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>

              </div>

            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 self-start"
            >
              <Trash2 size={22} />
            </button>

          </div>

        ))}

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-5">

        <div className="flex justify-between items-center mb-5">

          <div>

            <p className="text-gray-500">
              Total
            </p>

            <h2 className="text-3xl font-black text-[#B45309]">
              ₦{cartTotal}
            </h2>

          </div>

        </div>

        <PrimaryButton
          title="Proceed To Checkout"
          href="/customer/checkout"
        />

      </div>

    </main>
  );
}