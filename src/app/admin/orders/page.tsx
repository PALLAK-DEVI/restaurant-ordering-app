"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredOrders, updateStoredOrderStatus } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [fulfilmentFilter, setFulfilmentFilter] = useState<"all" | "delivery" | "pickup">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  const handleQuickAdvance = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus | undefined;
    if (currentStatus === "placed") nextStatus = "accepted";
    else if (currentStatus === "accepted") nextStatus = "preparing";
    else if (currentStatus === "preparing") {
      const target = orders.find((o) => o.id === orderId);
      nextStatus = target?.fulfilmentType === "pickup" ? "ready_for_pickup" : "out_for_delivery";
    } else if (currentStatus === "ready_for_pickup" || currentStatus === "out_for_delivery") {
      nextStatus = "delivered";
    }

    if (nextStatus) {
      updateStoredOrderStatus(orderId, nextStatus, "Admin Dashboard Quick Action");
      refreshOrders();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab !== "all" && o.status !== activeTab) return false;
      if (fulfilmentFilter !== "all" && o.fulfilmentType !== fulfilmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = o.orderNumber.toLowerCase().includes(q);
        const matchesName = o.guestName.toLowerCase().includes(q);
        const matchesPhone = o.guestPhone.includes(q);
        if (!matchesNum && !matchesName && !matchesPhone) return false;
      }
      return true;
    });
  }, [orders, activeTab, fulfilmentFilter, searchQuery]);

  return (
    <>
      <AdminHeader
        title="Kitchen Order Management"
        subtitle="Live orders queue, status progression, and kitchen fulfillment"
        actions={
          <button
            type="button"
            onClick={refreshOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-edge text-xs font-bold text-charcoal hover:bg-canvas shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Refresh Queue</span>
          </button>
        }
      />

      <main className="p-6 space-y-6 flex-1">
        {/* Status Filters Bar */}
        <div className="bg-white rounded-2xl border border-edge p-3 shadow-xs space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Orders", count: orders.length },
              { id: "placed", label: "New / Placed", count: orders.filter((o) => o.status === "placed").length },
              { id: "accepted", label: "Accepted", count: orders.filter((o) => o.status === "accepted").length },
              { id: "preparing", label: "In Tandoor", count: orders.filter((o) => o.status === "preparing").length },
              {
                id: "out_for_delivery",
                label: "Dispatched",
                count: orders.filter((o) => o.status === "out_for_delivery" || o.status === "ready_for_pickup").length,
              },
              { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
              {
                id: "cancelled",
                label: "Cancelled / Rejected",
                count: orders.filter((o) => o.status === "cancelled" || o.status === "rejected").length,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? "bg-charcoal text-white shadow-xs"
                      : "bg-canvas text-charcoal-muted hover:text-charcoal hover:bg-edge/40"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-edge text-charcoal-light"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Fulfilment Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-edge">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer, phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-edge rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-muted font-medium">Type:</span>
              <select
                value={fulfilmentFilter}
                onChange={(e) => setFulfilmentFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-canvas border border-edge text-charcoal text-xs font-medium cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="delivery">Delivery Only</option>
                <option value="pickup">Takeaway Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Order ID & Time</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Fulfilment</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                      No orders match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="hover:text-primary transition-colors hover:underline"
                        >
                          #{o.orderNumber}
                        </Link>
                        <span className="text-[10px] text-charcoal-muted block font-sans">
                          {formatDateTime(o.placedAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-charcoal block">{o.guestName}</strong>
                        <span className="text-[11px] text-charcoal-muted block">{o.guestPhone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            o.fulfilmentType === "delivery"
                              ? "bg-blue-50 text-blue-800"
                              : "bg-purple-50 text-purple-800"
                          }`}
                        >
                          {o.fulfilmentType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-charcoal truncate font-medium">
                          {o.items.map((i) => `${i.quantity}x ${i.productNameSnapshot}`).join(", ")}
                        </div>
                        {o.customerNotes && (
                          <div className="text-[10px] text-amber-700 italic truncate">
                            Note: "{o.customerNotes}"
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-charcoal">
                          {formatCurrency(o.grandTotal)}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-emerald-700">
                          {o.paymentMethod} • {o.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            o.status === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "placed"
                              ? "bg-amber-100 text-amber-800 animate-pulse font-black"
                              : o.status === "cancelled" || o.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1">
                        {/* Quick Action Button */}
                        {o.status === "placed" && (
                          <button
                            type="button"
                            onClick={() => handleQuickAdvance(o.id, o.status)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                          >
                            Accept
                          </button>
                        )}
                        {o.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() => handleQuickAdvance(o.id, o.status)}
                            className="px-2.5 py-1 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-2xs"
                          >
                            Cook in Tandoor
                          </button>
                        )}
                        {o.status === "preparing" && (
                          <button
                            type="button"
                            onClick={() => handleQuickAdvance(o.id, o.status)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                          >
                            {o.fulfilmentType === "pickup" ? "Ready" : "Dispatch"}
                          </button>
                        )}
                        {(o.status === "out_for_delivery" || o.status === "ready_for_pickup") && (
                          <button
                            type="button"
                            onClick={() => handleQuickAdvance(o.id, o.status)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                          >
                            Deliver
                          </button>
                        )}

                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-canvas hover:bg-edge border border-edge rounded-lg text-xs font-bold text-charcoal"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
