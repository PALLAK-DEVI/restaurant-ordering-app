"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Address,
  CartItem,
  CartItemAddon,
  Coupon,
  FulfilmentType,
  Product,
  ProductVariant,
} from "@/types";
import {
  calculateOrderPricing,
  PricingCalculationResult,
} from "@/lib/utils";
import { getCouponByCode, getStoredSettings } from "@/lib/store";

const CART_STORAGE_KEY = "royaltandoor_cart_v1";
const FULFILMENT_STORAGE_KEY = "royaltandoor_fulfilment_v1";
const ADDRESS_STORAGE_KEY = "royaltandoor_address_v1";

interface CartContextType {
  items: CartItem[];
  totalItemCount: number;
  pricing: PricingCalculationResult;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  fulfilmentType: FulfilmentType;
  deliveryAddress: Address;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    selectedVariant?: ProductVariant,
    selectedAddons?: CartItemAddon[],
    quantity?: number,
    itemNotes?: string
  ) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setFulfilmentType: (type: FulfilmentType) => void;
  setDeliveryAddress: (address: Address) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [fulfilmentType, setFulfilmentTypeState] = useState<FulfilmentType>("delivery");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [deliveryAddress, setDeliveryAddressState] = useState<Address>({
    line1: "",
    line2: "",
    landmark: "",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    deliveryInstructions: "",
  });

  // Restore cart on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(CART_STORAGE_KEY);
      if (savedItems) setItems(JSON.parse(savedItems));

      const savedFulfilment = localStorage.getItem(FULFILMENT_STORAGE_KEY);
      if (savedFulfilment === "delivery" || savedFulfilment === "pickup") {
        setFulfilmentTypeState(savedFulfilment);
      }

      const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (savedAddress) setDeliveryAddressState(JSON.parse(savedAddress));
    } catch (e) {
      console.warn("Failed to restore cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist cart items", e);
    }
  }, [items, isInitialized]);

  const setFulfilmentType = (type: FulfilmentType) => {
    setFulfilmentTypeState(type);
    if (typeof window !== "undefined") {
      localStorage.setItem(FULFILMENT_STORAGE_KEY, type);
    }
  };

  const setDeliveryAddress = (address: Address) => {
    setDeliveryAddressState(address);
    if (typeof window !== "undefined") {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
    }
  };

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const settings = useMemo(() => getStoredSettings(), []);

  const pricing = useMemo(() => {
    return calculateOrderPricing(items, appliedCoupon, fulfilmentType, settings);
  }, [items, appliedCoupon, fulfilmentType, settings]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    product: Product,
    selectedVariant?: ProductVariant,
    selectedAddons: CartItemAddon[] = [],
    quantity: number = 1,
    itemNotes?: string
  ) => {
    // Generate signature to detect if same item with identical customizations already exists
    const variantId = selectedVariant?.id || "none";
    const sortedAddonIds = selectedAddons.map((a) => a.id).sort().join(",");
    const notesKey = (itemNotes || "").trim();
    const itemInstanceId = `${product.id}_${variantId}_${sortedAddonIds}_${notesKey}`;

    const variantDelta = selectedVariant?.priceDelta || 0;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.basePrice + variantDelta + addonsTotal;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemInstanceId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        const newQty = copy[existingIndex].quantity + quantity;
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: newQty,
          lineTotal: copy[existingIndex].unitPrice * newQty,
        };
        return copy;
      }

      const newItem: CartItem = {
        id: itemInstanceId,
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        dietaryType: product.dietaryType,
        basePrice: product.basePrice,
        selectedVariant: selectedVariant
          ? {
              id: selectedVariant.id,
              name: selectedVariant.name,
              priceDelta: selectedVariant.priceDelta,
            }
          : undefined,
        selectedAddons,
        quantity,
        itemNotes,
        unitPrice,
        lineTotal: unitPrice * quantity,
      };

      return [...prev, newItem];
    });

    openCart();
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              lineTotal: item.unitPrice * newQuantity,
            }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setCouponError("Please enter a coupon code");
      return false;
    }

    const coupon = getCouponByCode(cleanCode);
    if (!coupon || !coupon.isActive) {
      setCouponError(`Coupon "${cleanCode}" is invalid or expired.`);
      return false;
    }

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    if (subtotal < coupon.minOrderValue) {
      setCouponError(`Min order value of ₹${coupon.minOrderValue / 100} required for ${cleanCode}`);
      return false;
    }

    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        pricing,
        appliedCoupon,
        couponError,
        fulfilmentType,
        deliveryAddress,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setFulfilmentType,
        setDeliveryAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
