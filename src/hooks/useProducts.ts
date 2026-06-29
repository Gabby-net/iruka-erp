"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    products,
    loading,
    reload: loadProducts,
  };
}