import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

/**
 * Get all active products
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return (data as Product[]) || [];
}

/**
 * Get one product by ID
 */
export async function getProductById(id: number): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data as Product;
}