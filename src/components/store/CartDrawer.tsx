"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  AlertCircle,
  Bike,
  Store,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import { formatCurrency } from "@/lib/utils";
import { getStoredSettings } from "@/lib/store";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    pricing,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    fulfilmentType,
    setFulfilmentType,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const settings = getStoredSettings();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(couponCodeInput)) {
      setCouponCodeInput("");
    }
  };

  const freeDeliveryShortfall =
    settings.freeDeliveryThreshold && pricing.subtotal < settings.freeDeliveryThreshold
      ? settings.freeDeliveryThreshold - pricing.subtotal
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-edge flex items-center justify-between bg-canvas/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal">Your Order Cart</h2>
                <p className="text-xs text-charcoal-muted">
                  {items.length === 0
                    ? "Cart is empty"
                    : `${items.reduce((s, i) => s + i.quantity, 0)} items selected`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-edge/40 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfilment Selector inside Cart */}
          <div className="px-6 py-2.5 bg-canvas border-b border-edge flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFulfilmentType("delivery")}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                fulfilmentType === "delivery"
                  ? "bg-white text-primary border-primary shadow-xs"
                  : "bg-transparent text-charcoal-muted border-transparent hover:bg-white/60"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setFulfilmentType("pickup")}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                fulfilmentType === "pickup"
                  ? "bg-white text-primary border-primary shadow-xs"
                  : "bg-transparent text-charcoal-muted border-transparent hover:bg-white/60"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Takeaway
            </button>
          </div>

          {/* Free Delivery Bar (if delivery selected) */}
          {fulfilmentType === "delivery" && settings.freeDeliveryThreshold > 0 && items.length > 0 && (
            <div className="bg-amber-50 px-6 py-2 border-b border-amber-100 text-xs">
              {freeDeliveryShortfall > 0 ? (
                <div className="space-y-1">
                  <div className="flex justify-between font-medium text-amber-900">
                    <span>
                      Add <strong>{formatCurrency(freeDeliveryShortfall)}</strong> more for FREE delivery
                    </span>
                    <span>
                      {Math.round((pricing.subtotal / settings.freeDeliveryThreshold) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (pricing.subtotal / settings.freeDeliveryThreshold) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Yay! You've unlocked FREE delivery!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-edge">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-20 h-20 rounded-full bg-canvas flex items-center justify-center text-charcoal-muted border border-edge">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal">Your cart is empty</h3>
                  <p className="text-sm text-charcoal-muted mt-1 max-w-xs">
                    Explore our appetizing tandoori specialties and add delicious items to begin.
                  </p>
                </div>
                <Link
                  href="/menu"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
                >
                  Browse Menu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 first:pt-0">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-canvas shrink-0 border border-edge">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <DietaryIcon type={item.dietaryType} size="sm" />
                        <h4 className="font-bold text-sm text-charcoal truncate">
                          {item.productName}
                        </h4>
                      </div>
                      <span className="font-extrabold text-sm text-charcoal shrink-0">
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </div>

                    {/* Customizations tags */}
                    <div className="text-xs text-charcoal-muted mt-0.5 space-y-0.5">
                      {item.selectedVariant && (
                        <p className="font-medium text-charcoal-light">
                          {item.selectedVariant.name}
                        </p>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[11px] text-charcoal-muted">
                          + {item.selectedAddons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.itemNotes && (
                        <p className="text-[11px] italic text-neutral-500">
                          Note: "{item.itemNotes}"
                        </p>
                      )}
                    </div>

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-edge rounded-lg bg-canvas overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-white text-charcoal transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white text-charcoal transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Bill Breakdown (only when items exist) */}
          {items.length > 0 && (
            <div className="border-t border-edge p-6 bg-canvas/40 space-y-4">
              {/* Coupon Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-800">
                        {appliedCoupon.code}
                      </span>{" "}
                      applied ({formatCurrency(pricing.discountTotal)} saved!)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-red-600 font-semibold text-xs ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        placeholder="Have a coupon code?"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase font-medium bg-white border border-edge rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-charcoal hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal-muted pt-2 border-t border-edge">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-medium text-charcoal">
                    {formatCurrency(pricing.subtotal)}
                  </span>
                </div>

                {pricing.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Coupon</span>
                    <span>-{formatCurrency(pricing.discountTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Restaurant Packaging Charge</span>
                  <span>{formatCurrency(pricing.packagingFee)}</span>
                </div>

                {fulfilmentType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span>
                      {pricing.deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[10px]">
                          FREE
                        </span>
                      ) : (
                        formatCurrency(pricing.deliveryFee)
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (5% Restaurant GST)</span>
                  <span>{formatCurrency(pricing.taxTotal)}</span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-charcoal pt-2 border-t border-edge">
                  <span>To Pay</span>
                  <span className="text-base text-primary">
                    {formatCurrency(pricing.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Minimum Order Warning */}
              {!pricing.isEligibleForDelivery && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Minimum order of {formatCurrency(settings.minimumOrderValue)} required to checkout.
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href={pricing.isEligibleForDelivery ? "/checkout" : "#"}
                onClick={() => {
                  if (pricing.isEligibleForDelivery) {
                    closeCart();
                  }
                }}
                aria-disabled={!pricing.isEligibleForDelivery}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-between shadow-md transition-all ${
                  pricing.isEligibleForDelivery
                    ? "bg-primary hover:bg-primary-hover text-white hover:shadow-lg active:scale-[0.99]"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                }`}
              >
                <div className="text-left">
                  <span className="text-xs uppercase tracking-wider block font-semibold opacity-90">
                    {items.length > 0 ? `${items.length} Items` : "Cart Total"}
                  </span>
                  <span className="text-base font-extrabold">
                    {formatCurrency(pricing.grandTotal)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
