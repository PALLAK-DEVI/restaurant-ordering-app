"use client";

import React, { useMemo, useState } from "react";
import { Users, Search, Phone, Mail, ShoppingBag, DollarSign } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredOrders } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const orders = useMemo(() => getStoredOrders(), []);
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate customer records from orders
  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        name: string;
        phone: string;
        email?: string;
        totalOrders: number;
        totalSpend: number;
        lastOrderDate: string;
        orderNumbers: string[];
      }
    >();

    orders.forEach((o) => {
      const key = (o.guestPhone || o.guestEmail || o.guestName).toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpend += o.grandTotal;
        existing.orderNumbers.push(o.orderNumber);
        if (new Date(o.placedAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.placedAt;
        }
      } else {
        map.set(key, {
          key,
          name: o.guestName,
          phone: o.guestPhone,
          email: o.guestEmail,
          totalOrders: 1,
          totalSpend: o.grandTotal,
          lastOrderDate: o.placedAt,
          orderNumbers: [o.orderNumber],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  return (
    <>
      <AdminHeader
        title="Customer Directory & Spending"
        subtitle="Patron contact directory, lifetime orders, and repeat dining engagement"
      />

      <main className="p-6 space-y-6 flex-1">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-edge p-4 shadow-xs flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers by name, phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-edge rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>
          <span className="text-xs text-charcoal-muted font-medium">
            {filtered.length} customers recorded
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Last Dining Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {filtered.map((c) => (
                  <tr key={c.key} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal font-medium">
                      <a href={`tel:${c.phone}`} className="hover:text-primary">
                        {c.phone}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {c.email || "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                      {c.totalOrders} {c.totalOrders === 1 ? "order" : "orders"}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-charcoal text-sm">
                      {formatCurrency(c.totalSpend)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-charcoal-muted">
                      {formatDate(c.lastOrderDate)}
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
