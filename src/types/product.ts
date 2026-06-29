export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  status: string;
  category: string;
  sku: string | null;
  cost_price: number;
  reorder_level: number;
  description: string;
  created_at: string;
}