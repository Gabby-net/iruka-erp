"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/customer/product/${product.id}`}
      className="block"
    >
      <div className="relative bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

        {/* Product Image */}

        <div className="bg-[#F8F8F8] h-56 flex items-center justify-center p-6">

          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain"
          />

        </div>

        {/* Product Details */}

        <div className="p-5">

          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            🟢 In Stock
          </span>

          <h3 className="mt-4 text-xl font-extrabold text-[#071028]">
            {product.name}
          </h3>

          <p className="mt-2 text-2xl font-black text-[#B45309]">
            ₦{product.price}
          </p>

        </div>

        {/* Add Button */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log("Add to cart:", product.name);

            // We'll replace this with real cart logic later.
          }}
          className="absolute bottom-5 right-5 h-12 w-12 rounded-full bg-[#B45309] text-white shadow-lg hover:bg-[#92400E] transition flex items-center justify-center"
        >
          <Plus size={22} />
        </button>

      </div>
    </Link>
  );
}