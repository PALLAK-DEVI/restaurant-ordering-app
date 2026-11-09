"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Bike,
  Store,
  Clock,
  Phone,
  ArrowRight,
  Receipt,
  MapPin,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { getOrderByIdOrToken, getStoredSettings } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function OrderSuccessClient({ orderId: initialOrderId }: { orderId?: string }) {
  const params = useParams();
  const orderId = initialOrderId || (params?.orderId as string);
  const settings = getStoredSettings();

  const order = useMemo(() => {
    return orderId ? getOrderByIdOrToken(orderId) : undefined;
  }, [orderId]);

  if (!order) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-2xl font-black text-charcoal">Order Not Found</h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            We could not retrieve details for this order id.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs sm:text-sm font-bold rounded-full"
          >
            Return to Menu
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Success Banner Card */}
          <div className="bg-white rounded-3xl border border-edge p-8 sm:p-10 shadow-card text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Received by Kitchen
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-charcoal mt-2">
                Thank You, {order.guestName.split(" ")[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-md mx-auto">
                Your order is confirmed and our chefs are preparing your royal feast.
              </p>
            </div>

            {/* Quick Order Info Pill */}
            <div className="bg-canvas rounded-2xl p-4 border border-edge grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-charcoal-muted block">Order Number</span>
                <strong className="text-charcoal font-mono text-sm">{order.orderNumber}</strong>
              </div>
              <div>
                <span className="text-charcoal-muted block">Fulfilment</span>
                <strong className="text-charcoal capitalize flex items-center justify-center gap-1">
                  {order.fulfilmentType === "delivery" ? (
                    <Bike className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Store className="w-3.5 h-3.5 text-primary" />
                  )}
                  {order.fulfilmentType}
                </strong>
              </div>
              <div>
                <span className="text-charcoal-muted block">Payment</span>
                <strong className="text-charcoal uppercase font-bold text-emerald-700">
                  {order.paymentMethod} ({order.paymentStatus})
                </strong>
              </div>
              <div>
                <span className="text-charcoal-muted block">Estimated Time</span>
                <strong className="text-primary font-bold">
                  {order.estimatedDeliveryMinutes || 35} Mins
                </strong>
              </div>
            </div>

            {/* Track Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/track/${order.guestTrackingToken || order.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span>Track Live Progress</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-canvas hover:bg-edge/60 text-charcoal font-semibold text-sm border border-edge transition-all"
              >
                <span>Back to Menu</span>
              </Link>
            </div>
          </div>

          {/* Itemized Receipt Card */}
          <div className="mt-8 bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-edge">
              <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <span>Bill & Item Details</span>
              </h3>
              <span className="text-xs text-charcoal-muted font-medium">
                Placed: {formatDateTime(order.placedAt)}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-edge">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">
                      {item.quantity}x {item.productNameSnapshot}
                    </h4>
                    {item.variantSnapshot && (
                      <p className="text-charcoal-muted mt-0.5">
                        {item.variantSnapshot.name}
                      </p>
                    )}
                    {item.addonsSnapshot && item.addonsSnapshot.length > 0 && (
                      <p className="text-[11px] text-charcoal-muted">
                        +{item.addonsSnapshot.map((a) => a.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-charcoal text-sm">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Snapshot Breakdown */}
            <div className="pt-4 border-t border-edge space-y-1.5 text-xs text-charcoal-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({order.couponCode})</span>
                  <span>-{formatCurrency(order.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant Packaging</span>
                <span>{formatCurrency(order.packagingFee)}</span>
              </div>
              {order.fulfilmentType === "delivery" && (
                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span>
                    {order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span>{formatCurrency(order.taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-charcoal pt-3 border-t border-edge">
                <span>Total Amount</span>
                <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>

            {/* Fulfilment Location Snapshot */}
            {order.fulfilmentType === "delivery" && order.addressSnapshot && (
              <div className="pt-4 border-t border-edge bg-canvas/60 p-4 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-charcoal flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Destination:
                </span>
                <p className="text-charcoal">{order.addressSnapshot.line1}</p>
                {order.addressSnapshot.landmark && (
                  <p className="text-charcoal-muted">Near {order.addressSnapshot.landmark}</p>
                )}
                <p className="text-charcoal-muted">
                  {order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.pincode}
                </p>
                {order.addressSnapshot.deliveryInstructions && (
                  <p className="italic text-neutral-500 pt-1">
                    Instructions: "{order.addressSnapshot.deliveryInstructions}"
                  </p>
                )}
              </div>
            )}

            {/* Restaurant Help */}
            <div className="pt-2 flex items-center justify-between text-xs text-charcoal-muted">
              <span>Need help with your order?</span>
              <a
                href={`tel:${settings.phone}`}
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Restaurant ({settings.phone})
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
