"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles } from "lucide-react";
import { Coupon } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OffersCarouselProps {
  coupons: Coupon[];
}

export function OffersCarousel({ coupons }: OffersCarouselProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  if (!coupons || coupons.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {coupons.map((c) => {
        const isCopied = copiedCode === c.code;
        return (
          <div
            key={c.id}
            className="relative bg-gradient-to-br from-amber-50 via-white to-red-50/30 rounded-2xl border border-amber-200/70 p-5 shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Promo Code
                  </span>
                  <div className="text-base font-extrabold text-charcoal tracking-tight">
                    {c.code}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(c.code)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  isCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-charcoal text-white hover:bg-black"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-charcoal-light font-medium mt-3 leading-relaxed">
              {c.description}
            </p>

            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Min order: {formatCurrency(c.minOrderValue)}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Instant Saving
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
