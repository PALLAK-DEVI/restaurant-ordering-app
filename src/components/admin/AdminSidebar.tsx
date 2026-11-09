"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Store,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { getStoredSettings } from "@/lib/store";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const settings = getStoredSettings();

  const links = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Live Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Menu Catalog", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Coupons & Deals", href: "/admin/coupons", icon: Tag },
    { label: "Reviews Moderation", href: "/admin/reviews", icon: MessageSquare },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Sales Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Restaurant Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 flex flex-col shrink-0 min-h-screen border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">
            RT
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight leading-tight">
              {settings.name.replace(" (Sample)", "")}
            </h2>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Staff Portal
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-sm font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Customer Site Link & User Profile */}
      <div className="p-4 border-t border-neutral-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700/80 text-white text-xs font-semibold transition-colors justify-center"
        >
          <Store className="w-3.5 h-3.5 text-primary" />
          <span>View Customer Site</span>
        </Link>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-neutral-800 text-primary font-bold flex items-center justify-center text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-bold text-white truncate">{user?.fullName || "Admin Staff"}</p>
              <p className="text-[10px] text-neutral-400 capitalize">{user?.role || "Staff"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
