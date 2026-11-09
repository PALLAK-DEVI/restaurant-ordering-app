"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight, Percent } from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { getStoredCoupons } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

export default function OffersPage() {
  const coupons = useMemo(() => getStoredCoupons(), []);
  const { applyCoupon, openCart } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyAndApply = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => {
      setCopiedCode(null);
      openCart();
    }, 800);
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        {/* Banner */}
        <section className="bg-neutral-900 text-white py-12 sm:py-16 border-b border-edge">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Percent className="w-4 h-4 text-primary" />
              <span>Verified Exclusive Deals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Deals, Combos & Promo Offers
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              Apply coupon codes during checkout to enjoy flat savings, percentage discounts, and free delivery on our royal preparations.
            </p>
          </div>
        </section>

        {/* Coupons List */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((c) => {
              const isCopied = copiedCode === c.code;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-edge p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-primary flex items-center justify-center shrink-0">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-primary-light text-primary font-black text-sm tracking-wider uppercase">
                            {c.code}
                          </div>
                          <p className="text-[11px] text-charcoal-muted mt-0.5">
                            {c.discountType === "percentage"
                              ? `${c.discountValue}% Instant Discount`
                              : `Flat ${formatCurrency(c.discountValue)} Off`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAndApply(c.code)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "bg-charcoal hover:bg-black text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Applied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Apply Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                      {c.description}
                    </p>

                    <div className="bg-canvas rounded-xl p-3 text-[11px] space-y-1 text-charcoal-muted">
                      <p>
                        • Minimum Cart Value:{" "}
                        <strong className="text-charcoal">{formatCurrency(c.minOrderValue)}</strong>
                      </p>
                      {c.maxDiscount && (
                        <p>
                          • Maximum Discount Cap:{" "}
                          <strong className="text-charcoal">{formatCurrency(c.maxDiscount)}</strong>
                        </p>
                      )}
                      <p className="flex items-center gap-1 text-neutral-500">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Valid until {formatDate(c.expiresAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-edge flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Applicable on Delivery & Pickup
                    </span>
                    <Link
                      href="/menu"
                      className="text-primary font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Order Food</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
