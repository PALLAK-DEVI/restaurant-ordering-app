export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'egg';

export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // e.g. "Half", "Full", "Small (2 pcs)", "Large (4 pcs)"
  priceDelta: number; // in paise (e.g. +8000 = +₹80.00)
  isRequired?: boolean;
  displayOrder?: number;
}

export interface ProductAddon {
  id: string;
  productId?: string; // specific product or global
  name: string; // e.g. "Extra Raita", "Mint Chutney", "Extra Gravy", "Extra Cheese"
  price: number; // in paise
  selectionGroup: string; // e.g. "Accompaniments", "Dips", "Crust"
  minSelect?: number;
  maxSelect?: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number; // in paise (e.g. 29900 = ₹299.00)
  imageUrl: string;
  dietaryType: DietaryType;
  spiceLevel?: 0 | 1 | 2 | 3; // 0=mild, 1=medium, 2=spicy, 3=extra hot
  tags: string[]; // e.g. ["Bestseller", "Chef's Special", "Must Try"]
  isBestseller: boolean;
  isAvailable: boolean;
  displayOrder: number;
  preparationTimeMinutes?: number;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

export interface CartItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  productId: string;
  productName: string;
  productImage: string;
  dietaryType: DietaryType;
  basePrice: number;
  selectedVariant?: {
    id: string;
    name: string;
    priceDelta: number;
  };
  selectedAddons: CartItemAddon[];
  quantity: number;
  itemNotes?: string;
  unitPrice: number; // basePrice + variant.priceDelta + sum(addon.price)
  lineTotal: number; // unitPrice * quantity
}

export type FulfilmentType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Address {
  id?: string;
  label?: string; // "Home", "Work", "Other"
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variantSnapshot?: {
    name: string;
    priceDelta: number;
  };
  addonsSnapshot?: {
    name: string;
    price: number;
  }[];
  itemNotes?: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  changedBy: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-2026-8910"
  userId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  fulfilmentType: FulfilmentType;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number; // in paise
  discountTotal: number;
  deliveryFee: number;
  taxTotal: number;
  packagingFee: number;
  grandTotal: number;
  couponCode?: string;
  addressSnapshot?: Address;
  customerNotes?: string;
  guestTrackingToken: string;
  estimatedDeliveryMinutes?: number;
  placedAt: string;
  updatedAt: string;
  items: OrderItemSnapshot[];
  statusHistory: OrderStatusHistoryItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 20) or paise (e.g. 5000 = ₹50)
  maxDiscount?: number; // max discount cap in paise
  minOrderValue: number; // in paise
  startsAt: string;
  expiresAt: string;
  usageLimit?: number;
  usageCount: number;
  perCustomerLimit?: number;
  isActive: boolean;
  description: string;
}

export interface Review {
  id: string;
  orderId?: string;
  userId?: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  moderationStatus: 'pending' | 'approved' | 'hidden';
  createdAt: string;
  foodItemsLiked?: string[];
}

export interface OperatingHoursDay {
  day: string; // 'Monday', 'Tuesday', etc.
  isOpen: boolean;
  openTime: string; // "11:00"
  closeTime: string; // "23:00"
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  heroBannerUrl: string;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  currency: string; // "INR"
  currencySymbol: string; // "₹"
  taxPercentage: number; // e.g. 5 (5% GST for restaurants in India)
  packagingCharge: number; // in paise, e.g. 2500 = ₹25
  minimumOrderValue: number; // in paise, e.g. 19900 = ₹199
  deliveryFee: number; // in paise, e.g. 4000 = ₹40
  freeDeliveryThreshold: number; // in paise, e.g. 50000 = ₹500
  isDeliveryEnabled: boolean;
  isPickupEnabled: boolean;
  isAcceptingOrders: boolean;
  servicePincodes: string[];
  defaultPrepTimeMinutes: number;
  operatingHours: OperatingHoursDay[];
  allowCod: boolean;
  allowOnlinePayment: boolean;
  razorpayKeyId?: string;
  isTestPaymentMode: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'customer' | 'staff' | 'admin';
  savedAddresses?: Address[];
  favoriteProductIds?: string[];
  createdAt: string;
}
