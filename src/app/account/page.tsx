"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  RotateCcw,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { getStoredOrders, getStoredProducts } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Address } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { addToCart, openCart } = useCart();
  const allOrders = useMemo(() => getStoredOrders(), []);
  const allProducts = useMemo(() => getStoredProducts(), []);

  // Filter orders for this customer (or all guest orders in demo mode)
  const myOrders = useMemo(() => {
    if (!user) return allOrders.slice(0, 5);
    return allOrders.filter(
      (o) =>
        o.userId === user.id ||
        (user.email && o.guestEmail?.toLowerCase() === user.email.toLowerCase()) ||
        o.guestPhone === user.phone
    );
  }, [allOrders, user]);

  // Address modal state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [line1, setLine1] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("122002");

  if (!isAuthenticated && !user) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-canvas text-charcoal-muted flex items-center justify-center mx-auto border border-edge">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-charcoal">Sign In Required</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-sm mx-auto">
            Please sign in to view your past orders, manage delivery addresses, and reorder favourite meals.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded-full shadow-md"
          >
            Sign In Now
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: addressLabel,
      line1: line1.trim(),
      landmark: landmark.trim() || undefined,
      city: "Gurugram",
      state: "Haryana",
      pincode: pincode.trim(),
      isDefault: (user?.savedAddresses?.length || 0) === 0,
    };

    const currentAddresses = user?.savedAddresses || [];
    updateProfile({ savedAddresses: [...currentAddresses, newAddr] });
    setIsAddingAddress(false);
    setLine1("");
    setLandmark("");
  };

  const handleReorder = (order: (typeof myOrders)[0]) => {
    order.items.forEach((item) => {
      const product = allProducts.find((p) => p.id === item.productId || p.name === item.productNameSnapshot);
      if (product) {
        addToCart(product, undefined, [], item.quantity);
      }
    });
    openCart();
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* User Header */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl border border-primary/20 shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h1 className="text-2xl font-black text-charcoal">{user?.fullName || "Guest Customer"}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted mt-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {user?.phone}
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
                    </span>
                  )}
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Royal Patron Club
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Order History (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  <span>Order History & Reordering</span>
                </h2>
                <span className="text-xs text-charcoal-muted">
                  {myOrders.length} {myOrders.length === 1 ? "order" : "orders"} placed
                </span>
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-edge p-10 text-center space-y-3">
                  <p className="text-xs text-charcoal-muted">No past orders found.</p>
                  <Link
                    href="/menu"
                    className="inline-block px-5 py-2 bg-primary text-white text-xs font-bold rounded-full"
                  >
                    Start an Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-edge p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-edge">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-charcoal">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                order.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <span className="text-xs text-charcoal-muted mt-0.5 block">
                            {formatDateTime(order.placedAt)} • {order.fulfilmentType}
                          </span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-base font-black text-charcoal block">
                            {formatCurrency(order.grandTotal)}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold uppercase">
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 text-xs text-charcoal-muted">
                        {order.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span>
                              {i.quantity}x {i.productNameSnapshot}
                              {i.variantSnapshot && ` (${i.variantSnapshot.name})`}
                            </span>
                            <span className="font-medium text-charcoal">
                              {formatCurrency(i.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions: Reorder & Track */}
                      <div className="pt-3 border-t border-edge flex items-center justify-between gap-3">
                        <Link
                          href={`/track/${order.guestTrackingToken || order.id}`}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Live Tracking Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder All</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Saved Addresses (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Saved Addresses</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-white rounded-2xl border border-edge p-5 shadow-xs space-y-3 text-xs animate-scale-in"
                >
                  <h4 className="font-bold text-charcoal">New Address</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">
                      Label
                    </label>
                    <select
                      value={addressLabel}
                      onChange={(e) => setAddressLabel(e.target.value)}
                      className="w-full p-2 bg-canvas border border-edge rounded-lg text-xs"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">
                      Street / Flat Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="e.g. Tower 2, Flat 401"
                      className="w-full p-2 bg-canvas border border-edge rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Community Center"
                      className="w-full p-2 bg-canvas border border-edge rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-2 bg-canvas border border-edge rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary text-white font-bold rounded-lg text-xs"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-2 bg-canvas text-charcoal-muted rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {user?.savedAddresses && user.savedAddresses.length > 0 ? (
                  user.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-2xl border border-edge p-4 shadow-xs space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-charcoal">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-canvas text-primary font-bold px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-charcoal-muted leading-relaxed">{addr.line1}</p>
                      {addr.landmark && (
                        <p className="text-charcoal-muted text-[11px]">Near {addr.landmark}</p>
                      )}
                      <p className="text-charcoal-muted font-mono text-[11px]">
                        {addr.city} - {addr.pincode}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-edge p-6 text-center text-xs text-charcoal-muted">
                    No saved addresses yet. Add one for faster 1-click checkout!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
