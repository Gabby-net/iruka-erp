import { supabase } from "@/lib/supabase";
import { CartItem } from "@/context/CartContext";

interface CreateOrderData {
  customerId: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  cart: CartItem[];
  total: number;
}

export async function createOrder({
  customerId,
  customerName,
  phone,
  deliveryMethod,
  deliveryAddress,
  cart,
  total,
}: CreateOrderData) {
  const orderNumber =
    "ORD-" + Date.now();

  // First Product
  const firstProduct =
    cart.length > 0 ? cart[0].name : "";

  // Total Quantity
  const totalQuantity =
    cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  // Create Main Order
  const { data: order, error } =
    await supabase
      .from("orders")
      .insert({
  customer_id: customerId,

  customer: customerName,
  customer_name: customerName,
  phone,

        bread: firstProduct,

        quantity: totalQuantity,

        price: total,

        total,

        total_amount: total,

        status: "Pending",

        payment_status:
          "Pending",

        order_status:
          "Pending",

        order_source:
          "Mobile App",

        order_number:
          orderNumber,

        notes:
          deliveryMethod ===
          "delivery"
            ? deliveryAddress
            : "Pickup",

        balance: total,

        paid: 0,
      })
      .select()
      .single();

  if (error) throw error;

  // Create Order Items

  const items = cart.map(
    (item) => ({
      order_id: order.id,

      bread_type: item.name,

      quantity: item.quantity,

      unit_price: item.price,

      total_amount:
        item.price *
        item.quantity,
    })
  );

  const { error: itemError } =
    await supabase
      .from("order_items")
      .insert(items);

  if (itemError)
    throw itemError;

  return order;
}