"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  Clock,
  Menu as MenuIcon,
  X,
  Bike,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { checkRestaurantOpenStatus, formatCurrency } from "@/lib/utils";
import { getStoredSettings } from "@/lib/store";

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItemCount, pricing, openCart, fulfilmentType, setFulfilmentType } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are in the admin dashboard, hide the public customer site header
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const settings = getStoredSettings();
  const { isOpen, statusText } = checkRestaurantOpenStatus(settings.operatingHours);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Offers", href: "/offers" },
    { label: "Reviews", href: "/reviews" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-edge transition-all">
      {/* Top Banner Notice (Demo Data Alert & Live Status) */}
      <div className="bg-charcoal text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="font-medium">{statusText}</span>
            <span className="hidden md:inline text-neutral-400">|</span>
            <span className="hidden md:inline text-neutral-300">
              Avg. Delivery: {settings.defaultPrepTimeMinutes + 20} mins
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-amber-200">
              Demo Preview (Sample Menu)
            </span>
            <Link
              href="/admin"
              className="text-neutral-300 hover:text-white underline underline-offset-2 flex items-center gap-1 font-medium text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Staff / Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xl group-hover:scale-105 transition-transform">
                RT
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl text-charcoal tracking-tight group-hover:text-primary transition-colors block leading-tight">
                  {settings.name.replace(" (Sample)", "")}
                </span>
                <span className="text-[11px] text-charcoal-muted tracking-wide uppercase font-semibold hidden sm:block">
                  Pure Indian Flavours
                </span>
              </div>
            </Link>

            {/* Fulfilment Toggle (Delivery vs Pickup) */}
            <div className="hidden lg:flex items-center bg-canvas p-1 rounded-full border border-edge text-xs font-medium">
              <button
                type="button"
                onClick={() => setFulfilmentType("delivery")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  fulfilmentType === "delivery"
                    ? "bg-white shadow-sm text-primary font-semibold"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setFulfilmentType("pickup")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  fulfilmentType === "pickup"
                    ? "bg-white shadow-sm text-primary font-semibold"
                    : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Takeaway
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-charcoal hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Account & Cart */}
          <div className="flex items-center gap-3">
            {/* Account Link */}
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="p-2 sm:px-3 sm:py-2 text-charcoal hover:text-primary rounded-lg hover:bg-canvas transition-colors flex items-center gap-2 text-sm font-medium"
              title={isAuthenticated ? user?.fullName : "Sign In"}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">
                {isAuthenticated ? (isAdmin ? "Admin" : user?.fullName?.split(" ")[0]) : "Sign In"}
              </span>
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full font-medium text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-charcoal text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-scale-in">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {totalItemCount > 0 ? formatCurrency(pricing.grandTotal) : "Cart"}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal hover:text-primary md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-edge bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          {/* Fulfilment Toggle on Mobile */}
          <div className="flex items-center bg-canvas p-1 rounded-full border border-edge text-xs font-medium mb-3">
            <button
              type="button"
              onClick={() => setFulfilmentType("delivery")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all ${
                fulfilmentType === "delivery"
                  ? "bg-white shadow-sm text-primary font-bold"
                  : "text-charcoal-muted"
              }`}
            >
              <Bike className="w-4 h-4" />
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setFulfilmentType("pickup")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all ${
                fulfilmentType === "pickup"
                  ? "bg-white shadow-sm text-primary font-bold"
                  : "text-charcoal-muted"
              }`}
            >
              <Store className="w-4 h-4" />
              Takeaway
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary-light text-primary font-semibold"
                    : "text-charcoal hover:bg-canvas"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-charcoal hover:bg-canvas flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-primary" />
              Track Order
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary-light flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
