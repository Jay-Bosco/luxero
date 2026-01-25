// Database types

export interface Watch {
  id: string;
  name: string;
  brand: string;
  collection: string;
  description: string;
  price: number; // in cents
  currency: string;
  images: string[];
  specifications: WatchSpecs;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface WatchSpecs {
  case_size: string;
  case_material: string;
  movement: string;
  water_resistance: string;
  power_reserve: string;
  dial_color: string;
  strap_material: string;
  reference_number: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  shipping_address?: Address;
  billing_address?: Address;
  created_at: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  watch_id: string;
  watch: Watch;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  escrow_status: EscrowStatus;
  escrow_id?: string;
  shipping_address: Address;
  billing_address: Address;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  watch_id: string;
  watch_name: string;
  watch_image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'        // Order created, awaiting payment
  | 'paid'           // Payment received, held in escrow
  | 'processing'     // Preparing for shipment
  | 'shipped'        // Item shipped, tracking provided
  | 'delivered'      // Marked as delivered
  | 'completed'      // Buyer confirmed, funds released
  | 'disputed'       // Buyer raised an issue
  | 'refunded'       // Order cancelled, funds returned
  | 'cancelled';

export type EscrowStatus =
  | 'pending'        // Awaiting payment
  | 'funded'         // Payment held in escrow
  | 'released'       // Funds released to seller
  | 'refunded'       // Funds returned to buyer
  | 'disputed';      // Under review

// Cart store type
export interface CartStore {
  items: CartItem[];
  addItem: (watch: Watch) => void;
  removeItem: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}
