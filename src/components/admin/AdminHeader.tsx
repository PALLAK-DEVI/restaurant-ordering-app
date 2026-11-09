"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Bell, Store, ExternalLink, ShieldAlert } from "lucide-react";
import { getStoredOrders } from "@/lib/store";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const orders = useMemo(() => getStoredOrders(), []);
  const pendingOrders = orders.filter((o) => o.status === "placed" || o.status === "accepted");

  return (
    <header className="bg-white border-b border-edge px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-charcoal-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingOrders.length} New Orders</span>
          </Link>
        )}

        {actions}
      </div>
    </header>
  );
}
