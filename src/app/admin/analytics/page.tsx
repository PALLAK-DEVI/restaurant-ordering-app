"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  PieChart,
  BarChart2,
  Bike,
  Store,
  Award,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredOrders, getStoredProducts } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const orders = useMemo(() => getStoredOrders(), []);
  const products = useMemo(() => getStoredProducts(), []);

  // Compute metrics
  const validOrders = orders.filter((o) => o.status !== "cancelled" && o.status !== "rejected");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalNetItems = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const deliveryOrders = validOrders.filter((o) => o.fulfilmentType === "delivery").length;
  const pickupOrders = validOrders.filter((o) => o.fulfilmentType === "pickup").length;

  const codOrders = validOrders.filter((o) => o.paymentMethod === "cod").length;
  const onlineOrders = validOrders.filter((o) => o.paymentMethod !== "cod").length;

  // Top selling dishes by frequency
  const itemPopularity = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; revenue: number }>();
    validOrders.forEach((o) => {
      o.items.forEach((i) => {
        const existing = map.get(i.productNameSnapshot);
        if (existing) {
          existing.quantity += i.quantity;
          existing.revenue += i.lineTotal;
        } else {
          map.set(i.productNameSnapshot, {
            name: i.productNameSnapshot,
            quantity: i.quantity,
            revenue: i.lineTotal,
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }, [validOrders]);

  return (
    <>
      <AdminHeader
        title="Sales & Operational Analytics"
        subtitle="Revenue performance, fulfillment channel split, and culinary bestseller rankings"
      />

      <main className="p-6 space-y-8 flex-1">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Gross Realized Revenue
            </span>
            <div className="text-3xl font-black text-charcoal">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Calculated from live order history
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Total Meals Served
            </span>
            <div className="text-3xl font-black text-charcoal">{totalNetItems} Portions</div>
            <p className="text-xs text-charcoal-muted">
              Across {validOrders.length} successful dining orders
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              Average Basket Value
            </span>
            <div className="text-3xl font-black text-primary">
              {formatCurrency(validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0)}
            </div>
            <p className="text-xs text-charcoal-muted">Per customer transaction</p>
          </div>
        </div>

        {/* Channel Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Split */}
          <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <span>Fulfilment Channel Split</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-primary" /> Doorstep Delivery
                  </span>
                  <span>
                    {deliveryOrders} Orders (
                    {validOrders.length > 0
                      ? Math.round((deliveryOrders / validOrders.length) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-canvas rounded-full overflow-hidden border border-edge">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${
                        validOrders.length > 0 ? (deliveryOrders / validOrders.length) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-purple-600" /> Direct Takeaway / Pickup
                  </span>
                  <span>
                    {pickupOrders} Orders (
                    {validOrders.length > 0
                      ? Math.round((pickupOrders / validOrders.length) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-canvas rounded-full overflow-hidden border border-edge">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{
                      width: `${
                        validOrders.length > 0 ? (pickupOrders / validOrders.length) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Split */}
          <div className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              <span>Payment Methods Chosen</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span>Cash on Delivery / Pickup</span>
                  <span>
                    {codOrders} Orders (
                    {validOrders.length > 0
                      ? Math.round((codOrders / validOrders.length) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-canvas rounded-full overflow-hidden border border-edge">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: `${
                        validOrders.length > 0 ? (codOrders / validOrders.length) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span>Online Payments (UPI / Cards / Net Banking)</span>
                  <span>
                    {onlineOrders} Orders (
                    {validOrders.length > 0
                      ? Math.round((onlineOrders / validOrders.length) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-3 bg-canvas rounded-full overflow-hidden border border-edge">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{
                      width: `${
                        validOrders.length > 0 ? (onlineOrders / validOrders.length) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Ordered Dishes Table */}
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="p-5 border-b border-edge flex items-center justify-between">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Highest Grossing Dishes & Portions</span>
            </h3>
            <span className="text-xs text-charcoal-muted">Ranked by volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Dish Name</th>
                  <th className="py-3 px-4">Quantity Ordered</th>
                  <th className="py-3 px-4 text-right">Total Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {itemPopularity.slice(0, 8).map((item, idx) => (
                  <tr key={item.name} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-charcoal font-mono">#{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-charcoal text-sm">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-charcoal">{item.quantity} units</td>
                    <td className="py-3 px-4 text-right font-black text-charcoal text-sm">
                      {formatCurrency(item.revenue)}
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
