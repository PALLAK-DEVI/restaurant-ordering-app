import {
  Category,
  Coupon,
  Order,
  OrderStatus,
  Product,
  RestaurantSettings,
  Review,
} from "@/types";
import {
  sampleCategories,
  sampleCoupons,
  sampleProducts,
  sampleRestaurantSettings,
  sampleReviews,
} from "@/lib/data/sample-data";

// Storage keys
const SETTINGS_KEY = "royaltandoor_settings_v1";
const CATEGORIES_KEY = "royaltandoor_categories_v1";
const PRODUCTS_KEY = "royaltandoor_products_v1";
const COUPONS_KEY = "royaltandoor_coupons_v1";
const ORDERS_KEY = "royaltandoor_orders_v1";
const REVIEWS_KEY = "royaltandoor_reviews_v1";

// Server memory cache fallback
let memorySettings: RestaurantSettings = { ...sampleRestaurantSettings };
let memoryCategories: Category[] = [...sampleCategories];
let memoryProducts: Product[] = [...sampleProducts];
let memoryCoupons: Coupon[] = [...sampleCoupons];
let memoryOrders: Order[] = [
  {
    id: "ord-seed-1",
    orderNumber: "ORD-2026-8921",
    guestName: "Aarav Sharma",
    guestPhone: "+91 98111 22233",
    guestEmail: "aarav@example.com",
    fulfilmentType: "delivery",
    status: "delivered",
    paymentMethod: "upi",
    paymentStatus: "paid",
    subtotal: 75700,
    discountTotal: 10000,
    deliveryFee: 0,
    taxTotal: 3410,
    packagingFee: 2500,
    grandTotal: 71610,
    couponCode: "WELCOME50",
    addressSnapshot: {
      line1: "Tower 4, Apt 802, Central Park II",
      landmark: "Near Clubhouse",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      deliveryInstructions: "Please ring bell and leave with security if unavailable",
    },
    guestTrackingToken: "track_aarav_8921",
    placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "item-1",
        productId: "prod-dal-makhani",
        productNameSnapshot: "Signature Dal Makhani (24-Hour Dum)",
        quantity: 1,
        unitPrice: 27900,
        lineTotal: 27900,
        addonsSnapshot: [{ name: "White Butter Dollop (Makkhan)", price: 3000 }],
      },
      {
        id: "item-2",
        productId: "prod-butter-chicken",
        productNameSnapshot: "Classic Butter Chicken (Murgh Makhani)",
        quantity: 1,
        unitPrice: 38900,
        lineTotal: 38900,
        variantSnapshot: { name: "With Bone", priceDelta: 0 },
      },
      {
        id: "item-3",
        productId: "prod-garlic-naan",
        productNameSnapshot: "Butter Garlic Naan",
        quantity: 2,
        unitPrice: 8500,
        lineTotal: 17000,
      },
    ],
    statusHistory: [
      {
        id: "sh-1",
        newStatus: "placed",
        changedBy: "Customer",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-2",
        oldStatus: "placed",
        newStatus: "accepted",
        changedBy: "Kitchen Staff",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-3",
        oldStatus: "accepted",
        newStatus: "preparing",
        changedBy: "Kitchen Staff",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-4",
        oldStatus: "preparing",
        newStatus: "out_for_delivery",
        changedBy: "Dispatcher",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-5",
        oldStatus: "out_for_delivery",
        newStatus: "delivered",
        changedBy: "Delivery Partner",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "ord-seed-2",
    orderNumber: "ORD-2026-9045",
    guestName: "Rohit Verma",
    guestPhone: "+91 98222 33344",
    guestEmail: "rohit.verma@example.com",
    fulfilmentType: "pickup",
    status: "preparing",
    paymentMethod: "cod",
    paymentStatus: "pending",
    subtotal: 36900,
    discountTotal: 0,
    deliveryFee: 0,
    taxTotal: 1970,
    packagingFee: 2500,
    grandTotal: 41370,
    guestTrackingToken: "track_rohit_9045",
    placedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    items: [
      {
        id: "item-4",
        productId: "prod-chicken-dum-biryani",
        productNameSnapshot: "Awadhi Chicken Dum Biryani",
        quantity: 1,
        unitPrice: 36900,
        lineTotal: 36900,
        variantSnapshot: { name: "Regular (Serves 1-2, 2 Chicken Pcs + 1 Egg)", priceDelta: 0 },
      },
    ],
    statusHistory: [
      {
        id: "sh-10",
        newStatus: "placed",
        changedBy: "Customer",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-11",
        oldStatus: "placed",
        newStatus: "accepted",
        changedBy: "Kitchen Staff",
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
      {
        id: "sh-12",
        oldStatus: "accepted",
        newStatus: "preparing",
        changedBy: "Head Chef",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      },
    ],
  },
];
let memoryReviews: Review[] = [...sampleReviews];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// -------------------------------------------------------------
// Settings
// -------------------------------------------------------------
export function getStoredSettings(): RestaurantSettings {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(sampleRestaurantSettings));
    } catch (e) {
      console.warn("Storage access failed, using memory", e);
    }
  }
  return memorySettings;
}

export function saveStoredSettings(settings: RestaurantSettings): RestaurantSettings {
  memorySettings = { ...settings };
  if (isBrowser()) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }
  return memorySettings;
}

// -------------------------------------------------------------
// Categories
// -------------------------------------------------------------
export function getStoredCategories(): Category[] {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sampleCategories));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }
  return memoryCategories;
}

export function saveStoredCategory(category: Category): Category[] {
  const current = getStoredCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: Category[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }
  memoryCategories = updated;
  if (isBrowser()) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteStoredCategory(id: string): Category[] {
  const current = getStoredCategories();
  const updated = current.filter((c) => c.id !== id);
  memoryCategories = updated;
  if (isBrowser()) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  }
  return updated;
}

// -------------------------------------------------------------
// Products
// -------------------------------------------------------------
export function getStoredProducts(): Product[] {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }
  return memoryProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function saveStoredProduct(product: Product): Product[] {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  memoryProducts = updated;
  if (isBrowser()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function toggleStoredProductAvailability(id: string): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  memoryProducts = updated;
  if (isBrowser()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteStoredProduct(id: string): Product[] {
  // Soft delete / hide product to preserve order history integrity
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== id);
  memoryProducts = updated;
  if (isBrowser()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

// -------------------------------------------------------------
// Coupons
// -------------------------------------------------------------
export function getStoredCoupons(): Coupon[] {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(COUPONS_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(COUPONS_KEY, JSON.stringify(sampleCoupons));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }
  return memoryCoupons;
}

export function getCouponByCode(code: string): Coupon | undefined {
  const coupons = getStoredCoupons();
  return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
}

export function saveStoredCoupon(coupon: Coupon): Coupon[] {
  const current = getStoredCoupons();
  const index = current.findIndex((c) => c.id === coupon.id);
  let updated: Coupon[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = coupon;
  } else {
    updated = [coupon, ...current];
  }
  memoryCoupons = updated;
  if (isBrowser()) {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteStoredCoupon(id: string): Coupon[] {
  const current = getStoredCoupons();
  const updated = current.filter((c) => c.id !== id);
  memoryCoupons = updated;
  if (isBrowser()) {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(updated));
  }
  return updated;
}

// -------------------------------------------------------------
// Orders
// -------------------------------------------------------------
export function getStoredOrders(): Order[] {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(memoryOrders));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }
  return memoryOrders;
}

export function getOrderByIdOrToken(idOrToken: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find(
    (o) =>
      o.id === idOrToken ||
      o.orderNumber.toLowerCase() === idOrToken.toLowerCase() ||
      o.guestTrackingToken === idOrToken
  );
}

export function createStoredOrder(order: Order): Order {
  const current = getStoredOrders();
  const updated = [order, ...current];
  memoryOrders = updated;
  if (isBrowser()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  }
  return order;
}

export function updateStoredOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  changedBy: string = "Staff",
  note?: string
): Order | undefined {
  const orders = getStoredOrders();
  const target = orders.find((o) => o.id === orderId);
  if (!target) return undefined;

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    placed: ["accepted", "rejected", "cancelled"],
    accepted: ["preparing", "cancelled"],
    preparing: ["ready_for_pickup", "out_for_delivery", "cancelled"],
    ready_for_pickup: ["delivered", "cancelled"],
    out_for_delivery: ["delivered", "cancelled"],
    delivered: [],
    rejected: [],
    cancelled: [],
  };

  // Check if transition is valid
  if (!validTransitions[target.status].includes(newStatus)) {
    console.warn(`Illegal status transition from ${target.status} to ${newStatus}`);
    // Still allow admin override if strictly needed, but log warning
  }

  const updatedOrder: Order = {
    ...target,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      ...target.statusHistory,
      {
        id: `sh-${Date.now()}`,
        oldStatus: target.status,
        newStatus,
        changedBy,
        timestamp: new Date().toISOString(),
        note,
      },
    ],
  };

  // If delivered, mark payment paid if COD
  if (newStatus === "delivered" && updatedOrder.paymentStatus === "pending") {
    updatedOrder.paymentStatus = "paid";
  }

  const updatedList = orders.map((o) => (o.id === orderId ? updatedOrder : o));
  memoryOrders = updatedList;
  if (isBrowser()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedList));
  }
  return updatedOrder;
}

// -------------------------------------------------------------
// Reviews
// -------------------------------------------------------------
export function getStoredReviews(): Review[] {
  if (isBrowser()) {
    try {
      const data = localStorage.getItem(REVIEWS_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(sampleReviews));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }
  return memoryReviews;
}

export function createStoredReview(review: Review): Review {
  const current = getStoredReviews();
  const updated = [review, ...current];
  memoryReviews = updated;
  if (isBrowser()) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  }
  return review;
}

export function updateStoredReviewStatus(id: string, moderationStatus: Review["moderationStatus"]): Review[] {
  const current = getStoredReviews();
  const updated = current.map((r) => (r.id === id ? { ...r, moderationStatus } : r));
  memoryReviews = updated;
  if (isBrowser()) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  }
  return updated;
}
