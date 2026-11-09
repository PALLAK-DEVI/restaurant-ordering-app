"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Tag, ShoppingBag, Clock } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItemCount, pricing, openCart } = useCart();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Menu", href: "/menu", icon: UtensilsCrossed },
    { label: "Offers", href: "/offers", icon: Tag },
    { label: "Track", href: "/track/demo", icon: Clock },
  ];

  return (
    <>
      {/* Sticky Bottom Cart Bar (if items exist in cart and not already on cart or checkout) */}
      {totalItemCount > 0 && pathname !== "/checkout" && (
        <div className="fixed bottom-16 left-0 right-0 p-3 z-30 md:hidden animate-slide-up">
          <button
            type="button"
            onClick={openCart}
            className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-2xl shadow-floating flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-primary text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
              <span>View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatCurrency(pricing.grandTotal)}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                Checkout →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main 4-Tab Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-edge py-2 px-4 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary font-bold" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary stroke-[2.5]" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={openCart}
            className="flex flex-col items-center gap-1 text-[11px] font-medium text-charcoal-muted hover:text-charcoal relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
}
