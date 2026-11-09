"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bike,
  Store,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import {
  formatCurrency,
  generateOrderNumber,
  generateTrackingToken,
  validatePincode,
} from "@/lib/utils";
import { createStoredOrder, getStoredSettings } from "@/lib/store";
import { Order, PaymentMethod } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, pricing, appliedCoupon, fulfilmentType, setFulfilmentType, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const settings = getStoredSettings();

  // Contact Info
  const [customerName, setCustomerName] = useState(user?.fullName || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");

  // Address (for delivery)
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Gurugram");
  const [state, setState] = useState("Haryana");
  const [pincode, setPincode] = useState("122002");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Delivery Scheduling
  const [deliveryTiming, setDeliveryTiming] = useState<"asap" | "scheduled">("asap");
  const [scheduledSlot, setScheduledSlot] = useState("7:30 PM - 8:00 PM");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty, show empty notice
  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-canvas text-charcoal-muted flex items-center justify-center mx-auto border border-edge">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-charcoal">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto">
            Please select your favourite tandoor kebabs, curries or biryanis to proceed with checkout.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded-full shadow-md"
          >
            Browse Royal Menu
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for order updates.");
      return;
    }

    if (fulfilmentType === "delivery") {
      if (!line1.trim()) {
        setErrorMessage("Please provide your delivery address (Flat / House / Street).");
        return;
      }

      if (!validatePincode(pincode, settings.servicePincodes)) {
        setErrorMessage(
          `Delivery is currently unavailable to pincode ${pincode}. Supported pincodes: ${settings.servicePincodes.join(
            ", "
          )}`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create Order Record
      const orderId = `ord-${Date.now()}`;
      const orderNumber = generateOrderNumber();
      const trackingToken = generateTrackingToken();

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        userId: user?.id,
        guestName: customerName.trim(),
        guestPhone: customerPhone.trim(),
        guestEmail: customerEmail.trim() || undefined,
        fulfilmentType,
        status: "placed",
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid", // in test mode, mark online payment as paid
        subtotal: pricing.subtotal,
        discountTotal: pricing.discountTotal,
        deliveryFee: pricing.deliveryFee,
        taxTotal: pricing.taxTotal,
        packagingFee: pricing.packagingFee,
        grandTotal: pricing.grandTotal,
        couponCode: appliedCoupon?.code,
        addressSnapshot:
          fulfilmentType === "delivery"
            ? {
                line1: line1.trim(),
                line2: line2.trim() || undefined,
                landmark: landmark.trim() || undefined,
                city,
                state,
                pincode: pincode.trim(),
                deliveryInstructions: deliveryInstructions.trim() || undefined,
              }
            : undefined,
        customerNotes:
          deliveryTiming === "scheduled"
            ? `Scheduled Slot: ${scheduledSlot}. ${deliveryInstructions}`
            : deliveryInstructions.trim() || undefined,
        guestTrackingToken: trackingToken,
        estimatedDeliveryMinutes: settings.defaultPrepTimeMinutes + (fulfilmentType === "delivery" ? 20 : 0),
        placedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: items.map((item) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: item.productId,
          productNameSnapshot: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          variantSnapshot: item.selectedVariant
            ? { name: item.selectedVariant.name, priceDelta: item.selectedVariant.priceDelta }
            : undefined,
          addonsSnapshot: item.selectedAddons.map((a) => ({ name: a.name, price: a.price })),
          itemNotes: item.itemNotes,
        })),
        statusHistory: [
          {
            id: `sh-${Date.now()}`,
            newStatus: "placed",
            changedBy: "Customer",
            timestamp: new Date().toISOString(),
            note: "Order placed via website checkout",
          },
        ],
      };

      // Persist in local repository store
      createStoredOrder(newOrder);

      // Clear Cart
      clearCart();

      // Redirect to Confirmation Screen
      router.push(`/order/success/${newOrder.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Back link */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping Menu</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mb-8">
            Complete Your Food Order
          </h1>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Fulfilment Selection */}
              <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    Fulfilment Preference
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFulfilmentType("delivery")}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      fulfilmentType === "delivery"
                        ? "border-primary bg-primary/5 text-charcoal shadow-xs"
                        : "border-edge hover:border-neutral-400 text-charcoal-muted"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        fulfilmentType === "delivery"
                          ? "bg-primary text-white"
                          : "bg-canvas text-charcoal-muted"
                      }`}
                    >
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-charcoal">Home Delivery</h4>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Delivered warm to your doorstep (30-45 mins)
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfilmentType("pickup")}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      fulfilmentType === "pickup"
                        ? "border-primary bg-primary/5 text-charcoal shadow-xs"
                        : "border-edge hover:border-neutral-400 text-charcoal-muted"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        fulfilmentType === "pickup"
                          ? "bg-primary text-white"
                          : "bg-canvas text-charcoal-muted"
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-charcoal">Direct Takeaway</h4>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Pick up directly from restaurant kitchen
                      </p>
                    </div>
                  </button>
                </div>

                {/* Timing Slot */}
                <div className="pt-2 flex items-center gap-4 text-xs font-medium text-charcoal">
                  <span className="text-charcoal-muted">Timing:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryTiming"
                      checked={deliveryTiming === "asap"}
                      onChange={() => setDeliveryTiming("asap")}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Deliver ASAP (Standard Kitchen Prep)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryTiming"
                      checked={deliveryTiming === "scheduled"}
                      onChange={() => setDeliveryTiming("scheduled")}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Schedule for Later Today</span>
                  </label>
                </div>

                {deliveryTiming === "scheduled" && (
                  <div className="p-3 bg-canvas rounded-xl border border-edge text-xs">
                    <label className="block text-charcoal font-bold mb-1">
                      Choose Time Window:
                    </label>
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-edge rounded-lg text-xs font-medium cursor-pointer"
                    >
                      <option value="1:30 PM - 2:00 PM">Lunch (1:30 PM - 2:00 PM)</option>
                      <option value="2:00 PM - 2:30 PM">Lunch (2:00 PM - 2:30 PM)</option>
                      <option value="7:30 PM - 8:00 PM">Dinner (7:30 PM - 8:00 PM)</option>
                      <option value="8:00 PM - 8:30 PM">Dinner (8:00 PM - 8:30 PM)</option>
                      <option value="8:30 PM - 9:00 PM">Dinner (8:30 PM - 9:00 PM)</option>
                      <option value="9:00 PM - 9:30 PM">Dinner (9:00 PM - 9:30 PM)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 2. Customer Contact */}
              <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  Customer & Order Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Vikram Mehta"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                      Phone Number (for SMS & Rider) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                      Email Address (Optional for Invoice & Tracking)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="vikram@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Delivery Address (Hidden if Takeaway) */}
              {fulfilmentType === "delivery" && (
                <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        3
                      </span>
                      Delivery Location & Pincode
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        House / Flat / Tower / Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={line1}
                        onChange={(e) => setLine1(e.target.value)}
                        placeholder="e.g. Flat 604, Tower B, Palm Springs Society"
                        className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        Landmark / Area (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Opposite Galleria Market"
                        className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        Delivery Pincode *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="122002"
                        className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                      />
                      <p className="text-[10px] text-charcoal-muted mt-1">
                        Serving: {settings.servicePincodes.slice(0, 5).join(", ")}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        Delivery Instructions for Rider (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        placeholder="e.g. Ring bell, leave with security if unavailable, call upon arrival"
                        className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Payment Method Selection */}
              <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {fulfilmentType === "delivery" ? "4" : "3"}
                  </span>
                  Choose Payment Option
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cash on Delivery */}
                  {settings.allowCod && (
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5 text-charcoal shadow-xs"
                          : "border-edge hover:border-neutral-400 text-charcoal-muted"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod === "cod"
                            ? "bg-primary text-white"
                            : "bg-canvas text-charcoal-muted"
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-charcoal">Cash on Delivery / Pickup</div>
                        <p className="text-xs text-charcoal-muted mt-0.5">
                          Pay cash or UPI directly when food arrives
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Online UPI / Cards / Net Banking */}
                  {settings.allowOnlinePayment && (
                    <label
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                        paymentMethod !== "cod"
                          ? "border-primary bg-primary/5 text-charcoal shadow-xs"
                          : "border-edge hover:border-neutral-400 text-charcoal-muted"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod !== "cod"
                            ? "bg-primary text-white"
                            : "bg-canvas text-charcoal-muted"
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-charcoal flex items-center gap-2">
                          <span>UPI / Card / Netbanking</span>
                          {settings.isTestPaymentMode && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                              Test Mode
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-charcoal-muted mt-0.5">
                          Google Pay, PhonePe, Paytm, RuPay, Cards
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                <div className="p-3 bg-canvas rounded-xl border border-edge text-xs text-charcoal-muted flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted checkout. No hidden convenience fees.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Bill (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-edge p-6 shadow-card space-y-6 sticky top-24">
                <h3 className="font-bold text-base text-charcoal pb-4 border-b border-edge">
                  Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-edge">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-charcoal">
                          {item.quantity}x {item.productName}
                        </div>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-charcoal-muted">
                            {item.selectedVariant.name}
                          </div>
                        )}
                        {item.selectedAddons.length > 0 && (
                          <div className="text-[10px] text-charcoal-muted">
                            +{item.selectedAddons.map((a) => a.name).join(", ")}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-charcoal shrink-0">
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 text-xs border-t border-edge pt-4 text-charcoal-muted">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal">{formatCurrency(pricing.subtotal)}</span>
                  </div>

                  {pricing.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Coupon ({appliedCoupon?.code})
                      </span>
                      <span>-{formatCurrency(pricing.discountTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Restaurant Packaging</span>
                    <span>{formatCurrency(pricing.packagingFee)}</span>
                  </div>

                  {fulfilmentType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
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
                    <span>Restaurant GST (5%)</span>
                    <span>{formatCurrency(pricing.taxTotal)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-charcoal pt-3 border-t border-edge">
                    <span>Grand Total</span>
                    <span className="text-primary">{formatCurrency(pricing.grandTotal)}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.99] flex items-center justify-between disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Placing Order..." : "Place Order"}</span>
                  <span>{formatCurrency(pricing.grandTotal)}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
