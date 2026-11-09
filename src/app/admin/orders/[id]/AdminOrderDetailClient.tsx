"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Bike,
  Store,
  Phone,
  Mail,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { KitchenOrderTicket } from "@/components/admin/KitchenOrderTicket";
import { getOrderByIdOrToken, updateStoredOrderStatus } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { OrderStatus } from "@/types";

export default function AdminOrderDetailClient({ id: initialId }: { id?: string }) {
  const params = useParams();
  const orderId = initialId || (params?.id as string);

  const [order, setOrder] = useState(() => (orderId ? getOrderByIdOrToken(orderId) : undefined));
  const [transitionNote, setTransitionNote] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal">Order Not Found</h2>
        <Link href="/admin/orders" className="text-primary font-bold text-xs underline">
          Return to Orders Queue
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    const updated = updateStoredOrderStatus(
      order.id,
      newStatus,
      "Staff Admin",
      transitionNote.trim() || undefined
    );
    if (updated) {
      setOrder(updated);
      setTransitionNote("");
      setActionFeedback(`Status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handlePrintKOT = () => {
    window.print();
  };

  // State transitions map
  const availableNextTransitions: { status: OrderStatus; label: string; color: string }[] = [];
  if (order.status === "placed") {
    availableNextTransitions.push(
      { status: "accepted", label: "Accept Order", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
      { status: "rejected", label: "Reject Order", color: "bg-red-600 hover:bg-red-700 text-white" }
    );
  } else if (order.status === "accepted") {
    availableNextTransitions.push(
      { status: "preparing", label: "Start Cooking in Tandoor", color: "bg-primary hover:bg-primary-hover text-white" },
      { status: "cancelled", label: "Cancel Order", color: "bg-neutral-800 hover:bg-black text-white" }
    );
  } else if (order.status === "preparing") {
    if (order.fulfilmentType === "pickup") {
      availableNextTransitions.push(
        { status: "ready_for_pickup", label: "Mark Ready for Pickup", color: "bg-blue-600 hover:bg-blue-700 text-white" }
      );
    } else {
      availableNextTransitions.push(
        { status: "out_for_delivery", label: "Handover to Delivery Rider", color: "bg-blue-600 hover:bg-blue-700 text-white" }
      );
    }
    availableNextTransitions.push(
      { status: "cancelled", label: "Cancel Order", color: "bg-neutral-800 hover:bg-black text-white" }
    );
  } else if (order.status === "ready_for_pickup" || order.status === "out_for_delivery") {
    availableNextTransitions.push(
      { status: "delivered", label: "Mark Delivered / Completed", color: "bg-emerald-600 hover:bg-emerald-700 text-white" }
    );
  }

  return (
    <>
      <AdminHeader
        title={`Order #${order.orderNumber}`}
        subtitle={`Placed on ${formatDateTime(order.placedAt)} • ${order.fulfilmentType.toUpperCase()}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintKOT}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print KOT Ticket</span>
            </button>
          </div>
        }
      />

      <main className="p-6 space-y-6 flex-1 max-w-6xl">
        {/* Back navigation */}
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {actionFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details & Items (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status & Transition Bar Card */}
            <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-edge">
                <div>
                  <span className="text-[10px] font-bold uppercase text-charcoal-muted">
                    Current Fulfillment Status
                  </span>
                  <div className="text-lg font-black text-charcoal uppercase mt-0.5 flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "placed"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "cancelled" || order.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-charcoal-muted">
                    Payment Status
                  </span>
                  <p className="text-xs font-black uppercase text-emerald-700">
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Status Transition Actions */}
              {availableNextTransitions.length > 0 ? (
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-charcoal block">
                    Advance Order State:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {availableNextTransitions.map((t) => (
                      <button
                        key={t.status}
                        type="button"
                        onClick={() => handleStatusChange(t.status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${t.color}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <input
                      type="text"
                      value={transitionNote}
                      onChange={(e) => setTransitionNote(e.target.value)}
                      placeholder="Optional internal kitchen/rider note..."
                      className="w-full px-3 py-1.5 text-xs bg-canvas border border-edge rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-charcoal-muted italic">
                  Order has reached terminal state ({order.status}). No further transitions allowed.
                </div>
              )}
            </div>

            {/* Itemized Order Table */}
            <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
              <div className="p-5 border-b border-edge">
                <h3 className="font-bold text-sm text-charcoal">Ordered Dishes & Customizations</h3>
              </div>
              <div className="divide-y divide-edge">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm text-charcoal">
                        {item.quantity}x {item.productNameSnapshot}
                      </div>
                      {item.variantSnapshot && (
                        <p className="text-charcoal-muted font-medium">
                          Portion: {item.variantSnapshot.name}
                        </p>
                      )}
                      {item.addonsSnapshot && item.addonsSnapshot.length > 0 && (
                        <p className="text-[11px] text-charcoal-muted">
                          Addons: {item.addonsSnapshot.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.itemNotes && (
                        <p className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded italic font-semibold">
                          Special Note: "{item.itemNotes}"
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm text-charcoal">
                        {formatCurrency(item.lineTotal)}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block">
                        ({formatCurrency(item.unitPrice)} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-5 bg-canvas/60 border-t border-edge space-y-1.5 text-xs text-charcoal-muted">
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
                  <span>Packaging Charge</span>
                  <span>{formatCurrency(order.packagingFee)}</span>
                </div>
                {order.fulfilmentType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span>{formatCurrency(order.taxTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-charcoal pt-2 border-t border-edge">
                  <span>Grand Total</span>
                  <span className="text-primary">{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Audit Trail Log */}
            <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal">
                State Transition Audit History
              </h3>
              <div className="space-y-2 text-xs">
                {order.statusHistory.map((sh) => (
                  <div
                    key={sh.id}
                    className="p-2.5 rounded-xl bg-canvas border border-edge flex items-center justify-between text-charcoal-muted"
                  >
                    <div>
                      <span className="font-bold text-charcoal capitalize">
                        {sh.newStatus.replace(/_/g, " ")}
                      </span>{" "}
                      by <span className="font-medium text-charcoal">{sh.changedBy}</span>
                      {sh.note && <span className="italic ml-2 text-neutral-500">"{sh.note}"</span>}
                    </div>
                    <span className="text-[11px] font-mono">{formatDateTime(sh.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Delivery Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal">
                Customer Information
              </h3>
              <div className="space-y-2.5 text-xs text-charcoal-light">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal text-sm">{order.guestName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <a href={`tel:${order.guestPhone}`} className="text-primary font-semibold hover:underline">
                    {order.guestPhone}
                  </a>
                </div>
                {order.guestEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>{order.guestEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fulfilment Destination Card */}
            <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                {order.fulfilmentType === "delivery" ? (
                  <Bike className="w-4 h-4 text-primary" />
                ) : (
                  <Store className="w-4 h-4 text-primary" />
                )}
                <span>Fulfilment Destination</span>
              </h3>

              {order.fulfilmentType === "delivery" && order.addressSnapshot ? (
                <div className="text-xs text-charcoal-muted space-y-1 leading-relaxed">
                  <p className="font-bold text-charcoal">{order.addressSnapshot.line1}</p>
                  {order.addressSnapshot.landmark && (
                    <p>Near {order.addressSnapshot.landmark}</p>
                  )}
                  <p className="font-mono">
                    {order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.pincode}
                  </p>
                  {order.addressSnapshot.deliveryInstructions && (
                    <p className="p-2 bg-canvas rounded-lg italic text-[11px] text-neutral-600 mt-2">
                      Rider instructions: "{order.addressSnapshot.deliveryInstructions}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-charcoal-muted">
                  <p className="font-semibold text-charcoal">Direct Restaurant Takeaway</p>
                  <p className="mt-1">Customer will pick up order in-store at pickup counter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Printable Kitchen Ticket (Hidden on screen, visible during window.print) */}
      <KitchenOrderTicket order={order} />
    </>
  );
}
