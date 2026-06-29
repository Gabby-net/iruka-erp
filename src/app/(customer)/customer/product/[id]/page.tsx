"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

import { Product } from "@/types/product";
import { getProductById } from "@/services/products";
import PrimaryButton from "@/components/customer-app/PrimaryButton";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const data = await getProductById(
        Number(params.id)
      );

      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Product not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}

      <div className="bg-[#071028] rounded-b-[35px] px-6 pt-12 pb-8">

        <div className="flex items-center justify-between">

          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft
              className="text-white"
              size={20}
            />
          </button>

          <h1 className="text-white text-xl font-bold">
            Product Details
          </h1>

          <div className="w-10" />

        </div>

      </div>

      <div className="max-w-xl mx-auto p-6">

        {/* Product Image */}

        <div className="bg-white rounded-3xl shadow-md p-8">

          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-72 object-contain"
          />

        </div>

        {/* Product Info */}

        <div className="mt-8">

          <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            🟢 In Stock
          </span>

          <h1 className="mt-5 text-4xl font-black text-[#071028]">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-black text-[#B45309]">
            ₦{product.price}
          </p>

          <div className="mt-6">

            <h2 className="font-bold text-lg">
              Description
            </h2>

            <p className="text-gray-600 leading-8 mt-2">
              {product.description}
            </p>

          </div>

          {/* Quantity */}

          <div className="mt-8">

            <h2 className="font-bold text-lg mb-4">
              Quantity
            </h2>

            <div className="flex items-center gap-5">

              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center"
              >
                <Minus />
              </button>

              <span className="text-2xl font-black">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="w-12 h-12 rounded-full bg-[#B45309] text-white flex items-center justify-center"
              >
                <Plus />
              </button>

            </div>

          </div>
                    {/* Delivery Option */}

          <div className="mt-8">

            <h2 className="font-bold text-lg mb-4">
              Delivery Method
            </h2>

            <div className="space-y-3">

              <label className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow cursor-pointer">

                <input
                  type="radio"
                  name="delivery"
                  defaultChecked
                />

                <span>🏪 Pickup from Bakery</span>

              </label>

              <label className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow cursor-pointer">

                <input
                  type="radio"
                  name="delivery"
                />

                <span>🚚 Home Delivery</span>

              </label>

            </div>

          </div>

          {/* Total */}

          <div className="mt-8 bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center">

              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-3xl font-black text-[#B45309]">
                ₦{product.price * quantity}
              </span>

            </div>

          </div>

          {/* Add To Cart */}

          <div className="mt-8">

<PrimaryButton
  title="Add To Cart"
  onClick={() => {
    console.log("PRODUCT:", product);

    console.log("QUANTITY:", quantity);

    addToCart(product, quantity);

    console.log("Added to Cart!");

    alert(`${product.name} added to cart successfully!`);
  }}
/>

          </div>

        </div>

      </div>

    </main>
  );
}