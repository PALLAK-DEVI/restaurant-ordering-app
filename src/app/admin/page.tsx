"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Eye,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredOrders, getStoredProducts } from "@/lib/store";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  const orders = useMemo(() => getStoredOrders(), []);
  const products = useMemo(() => getStoredProducts(), []);

  // Compute live KPIs
  const totalSales = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "rejected")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const pendingCount = orders.filter((o) => o.status === "placed" || o.status === "accepted").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;

  const recentOrders = orders.slice(0, 6);

  return (
    <>
      <AdminHeader
        title="Kitchen & Operations Overview"
        subtitle="Live metrics, pending preparation queue, and incoming customer orders"
      />

      <main className="p-6 space-y-8 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Total Revenue
              </span>
              <div className="text-2xl font-black text-charcoal mt-1">
                {formatCurrency(totalSales)}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                From {orders.length} lifetime orders
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Pending Queue */}
          <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Pending Acceptance
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {pendingCount}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                Requires Kitchen Action
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* In Cooking / Prep */}
          <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                In Tandoor / Cooking
              </span>
              <div className="text-2xl font-black text-primary mt-1">
                {preparingCount}
              </div>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                Currently on the line
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-2xl border border-edge p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Avg. Ticket Size
              </span>
              <div className="text-2xl font-black text-charcoal mt-1">
                {formatCurrency(avgOrderValue)}
              </div>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                Per completed basket
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-charcoal flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="p-5 border-b border-edge flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-charcoal">Recent Kitchen Orders</h2>
              <p className="text-xs text-charcoal-muted">
                Latest customer orders across delivery and direct takeaway.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Queue ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                      #{o.orderNumber}
                      <span className="text-[10px] text-charcoal-muted block font-sans">
                        {formatDateTime(o.placedAt)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {o.guestName}
                      <span className="text-[11px] text-charcoal-muted block">{o.guestPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          o.fulfilmentType === "delivery"
                            ? "bg-blue-50 text-blue-800"
                            : "bg-purple-50 text-purple-800"
                        }`}
                      >
                        {o.fulfilmentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted max-w-xs truncate">
                      {o.items.map((i) => `${i.quantity}x ${i.productNameSnapshot}`).join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-charcoal">
                      {formatCurrency(o.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          o.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "placed"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : o.status === "cancelled" || o.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-canvas hover:bg-edge/60 border border-edge rounded-lg font-bold text-charcoal text-xs transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
