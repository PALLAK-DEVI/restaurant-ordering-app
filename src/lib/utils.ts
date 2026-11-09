import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem, Coupon, FulfilmentType, RestaurantSettings } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money in paise (minor units) to INR currency display
 * e.g. 29900 -> "₹299" or 29950 -> "₹299.50"
 */
export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  if (Number.isInteger(rupees)) {
    return `₹${rupees.toLocaleString('en-IN')}`;
  }
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${timestamp}-${random}`;
}

export function generateTrackingToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export interface PricingCalculationResult {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  packagingFee: number;
  deliveryFee: number;
  grandTotal: number;
  isEligibleForDelivery: boolean;
  couponError?: string;
  appliedCoupon?: Coupon;
}

/**
 * Centralized, authoritative pricing engine for both client preview and server verification.
 * All prices in paise.
 */
export function calculateOrderPricing(
  items: CartItem[],
  coupon: Coupon | null | undefined,
  fulfilmentType: FulfilmentType,
  settings: RestaurantSettings
): PricingCalculationResult {
  // 1. Calculate raw subtotal from valid items
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  // 2. Validate & apply coupon
  let discountTotal = 0;
  let couponError: string | undefined;

  if (coupon && coupon.isActive) {
    if (subtotal < coupon.minOrderValue) {
      couponError = `Minimum order of ${formatCurrency(coupon.minOrderValue)} required for code ${coupon.code}`;
    } else {
      if (coupon.discountType === "percentage") {
        const rawDiscount = Math.round((subtotal * coupon.discountValue) / 100);
        discountTotal = coupon.maxDiscount
          ? Math.min(rawDiscount, coupon.maxDiscount)
          : rawDiscount;
      } else {
        discountTotal = coupon.discountValue;
      }
      // Cannot discount more than subtotal
      discountTotal = Math.min(discountTotal, subtotal);
    }
  }

  // 3. Packaging charge
  const packagingFee = items.length > 0 ? settings.packagingCharge : 0;

  // 4. Delivery fee
  let deliveryFee = 0;
  if (fulfilmentType === "delivery" && items.length > 0) {
    if (settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = settings.deliveryFee;
    }
  }

  // 5. Taxes (GST) calculated on discounted subtotal + packaging
  const taxableAmount = Math.max(0, subtotal - discountTotal + packagingFee);
  const taxTotal = Math.round((taxableAmount * settings.taxPercentage) / 100);

  // 6. Grand total
  const grandTotal = Math.max(0, subtotal - discountTotal + packagingFee + deliveryFee + taxTotal);

  return {
    subtotal,
    discountTotal,
    taxTotal,
    packagingFee,
    deliveryFee,
    grandTotal,
    isEligibleForDelivery: subtotal >= settings.minimumOrderValue,
    couponError,
    appliedCoupon: discountTotal > 0 && coupon ? coupon : undefined,
  };
}

export function validatePincode(pincode: string, servicePincodes: string[]): boolean {
  if (!pincode || pincode.trim().length !== 6) return false;
  const clean = pincode.trim();
  return servicePincodes.includes(clean);
}

export function getEstimatedDeliveryTime(prepTimeMinutes: number, isPickup: boolean): string {
  const transitTime = isPickup ? 0 : 20; // 20 mins avg delivery transit in city
  const total = prepTimeMinutes + transitTime;
  return `${total}-${total + 15} mins`;
}

export function checkRestaurantOpenStatus(operatingHours: RestaurantSettings["operatingHours"]): {
  isOpen: boolean;
  statusText: string;
} {
  try {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const currentDayName = days[now.getDay()];
    const todaySchedule = operatingHours.find((h) => h.day.toLowerCase() === currentDayName.toLowerCase());

    if (!todaySchedule || !todaySchedule.isOpen) {
      return { isOpen: false, statusText: "Closed today" };
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = todaySchedule.openTime.split(":").map(Number);
    const [closeH, closeM] = todaySchedule.closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
      return { isOpen: true, statusText: `Open now until ${todaySchedule.closeTime}` };
    }

    if (currentMinutes < openMinutes) {
      return { isOpen: false, statusText: `Opens today at ${todaySchedule.openTime}` };
    }

    return { isOpen: false, statusText: "Closed for today" };
  } catch {
    return { isOpen: true, statusText: "Open for orders" };
  }
}
