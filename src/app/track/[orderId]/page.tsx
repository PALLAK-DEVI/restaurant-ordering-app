"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Phone,
  ChefHat,
  PackageCheck,
  AlertTriangle,
  MapPin,
  RefreshCw,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { getOrderByIdOrToken, getStoredSettings } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const settings = getStoredSettings();

  const [order, setOrder] = useState<Order | undefined>(() => {
    return orderId ? getOrderByIdOrToken(orderId) : undefined;
  });

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll order status periodically (every 4 seconds) to reflect admin status updates
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      const refreshed = getOrderByIdOrToken(orderId);
      if (refreshed) {
        setOrder(refreshed);
        setLastRefreshed(new Date());
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  const manualRefresh = () => {
    setIsRefreshing(true);
    const refreshed = getOrderByIdOrToken(orderId);
    if (refreshed) {
      setOrder(refreshed);
      setLastRefreshed(new Date());
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!order) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-canvas text-charcoal-muted flex items-center justify-center mx-auto border border-edge">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-charcoal">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
            We could not locate an active order matching this tracking identifier.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/menu"
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full"
            >
              Order Food
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  // Delivery Status Milestones
  const deliverySteps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: "placed",
      label: "Order Placed",
      desc: "Sent to restaurant kitchen",
      icon: Clock,
    },
    {
      status: "accepted",
      label: "Order Accepted",
      desc: "Kitchen confirmed order",
      icon: CheckCircle2,
    },
    {
      status: "preparing",
      label: "Cooking in Tandoor",
      desc: "Fresh preparations underway",
      icon: ChefHat,
    },
    {
      status: order.fulfilmentType === "delivery" ? "out_for_delivery" : "ready_for_pickup",
      label: order.fulfilmentType === "delivery" ? "Out for Delivery" : "Ready for Pickup",
      desc: order.fulfilmentType === "delivery" ? "Rider is heading to you" : "Awaiting your collection",
      icon: order.fulfilmentType === "delivery" ? Bike : Store,
    },
    {
      status: "delivered",
      label: "Delivered & Enjoyed",
      desc: "Order fulfilled successfully",
      icon: PackageCheck,
    },
  ];

  // Map status index
  const statusHierarchy: Record<OrderStatus, number> = {
    placed: 0,
    accepted: 1,
    preparing: 2,
    ready_for_pickup: 3,
    out_for_delivery: 3,
    delivered: 4,
    rejected: -1,
    cancelled: -1,
  };

  const currentStepIndex = statusHierarchy[order.status] ?? 0;
  const isTerminated = order.status === "rejected" || order.status === "cancelled";

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Back link */}
          <div className="flex items-center justify-between">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>

            <button
              type="button"
              onClick={manualRefresh}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Tracking Status Card */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-edge">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Live Order Tracker
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-charcoal mt-0.5">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-xs text-charcoal-muted mt-1">
                  Placed on {formatDateTime(order.placedAt)} • {order.fulfilmentType.toUpperCase()}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {order.status === "delivered" ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    DELIVERED
                  </span>
                ) : isTerminated ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                    <XCircle className="w-4 h-4" />
                    {order.status.toUpperCase()}
                  </span>
                ) : (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20">
                      <Clock className="w-4 h-4 animate-pulse" />
                      {order.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <p className="text-[11px] text-charcoal-muted mt-1 font-medium">
                      Estimated: ~{order.estimatedDeliveryMinutes || 35} mins
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cancelled / Rejected Alert */}
            {isTerminated && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-red-900">
                    Order {order.status === "rejected" ? "Declined by Kitchen" : "Cancelled"}
                  </h4>
                  <p className="mt-1 leading-relaxed">
                    {order.status === "rejected"
                      ? "The kitchen could not accept this order due to capacity or closing hours. Any payment made will be refunded immediately."
                      : "This order has been cancelled. Please contact our support team if you have questions."}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline Progress */}
            {!isTerminated && (
              <div className="py-6">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative">
                  {deliverySteps.map((step, idx) => {
                    const isCompleted = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center relative">
                        {/* Circle Indicator */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            isCompleted
                              ? "bg-primary border-primary text-white shadow-xs"
                              : "bg-canvas border-edge text-neutral-400"
                          } ${isCurrent ? "ring-4 ring-primary/20 animate-pulse" : ""}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isCompleted ? "text-charcoal" : "text-neutral-400"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-charcoal-muted mt-0.5 hidden sm:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status History Audit Log */}
            <div className="pt-4 border-t border-edge">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                Live Kitchen Event Log
              </h3>
              <div className="space-y-2 text-xs">
                {order.statusHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-edge text-charcoal-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-semibold text-charcoal capitalize">
                        {hist.newStatus.replace(/_/g, " ")}
                      </span>
                      {hist.note && <span>— {hist.note}</span>}
                    </div>
                    <span className="text-[11px] font-mono">{formatDateTime(hist.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Call Bar */}
            <div className="pt-4 border-t border-edge flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-charcoal-muted">
                Question regarding preparation or address?
              </span>
              <a
                href={`tel:${settings.phone}`}
                className="px-4 py-2 bg-charcoal hover:bg-black text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Restaurant ({settings.phone})</span>
              </a>
            </div>
          </div>

          {/* Order Details Accordion / Summary */}
          <div className="bg-white rounded-3xl border border-edge p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal">Items in This Order</h3>
            <div className="divide-y divide-edge text-xs">
              {order.items.map((i) => (
                <div key={i.id} className="py-2.5 flex justify-between">
                  <div>
                    <span className="font-bold text-charcoal">
                      {i.quantity}x {i.productNameSnapshot}
                    </span>
                    {i.variantSnapshot && (
                      <span className="text-charcoal-muted block">{i.variantSnapshot.name}</span>
                    )}
                    {i.addonsSnapshot && i.addonsSnapshot.length > 0 && (
                      <span className="text-[11px] text-charcoal-muted block">
                        +{i.addonsSnapshot.map((a) => a.name).join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-charcoal">{formatCurrency(i.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-edge flex justify-between font-extrabold text-sm text-charcoal">
              <span>Grand Total</span>
              <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
