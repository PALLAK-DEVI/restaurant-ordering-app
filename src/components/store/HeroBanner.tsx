"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, ShieldCheck, Clock, Award } from "lucide-react";
import { getStoredSettings } from "@/lib/store";

export function HeroBanner() {
  const settings = getStoredSettings();

  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={settings.heroBannerUrl}
          alt="Charcoal Tandoor & Indian Feast"
          fill
          priority
          className="object-cover object-center opacity-45 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-2xl space-y-6">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Flame className="w-4 h-4 text-primary fill-primary" />
            <span>Clay Oven Roasted • 100% Desi Ghee</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Authentic Charcoal Tandoor & <span className="text-primary">Royal Flavours</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            Taste the richness of 24-hour slow-cooked Dal Makhani, fragrant Awadhi Dum Biryanis, and melt-in-mouth kebabs delivered sizzling hot to your doorstep.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Order Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3.5 rounded-full font-semibold text-base border border-white/20 transition-all"
            >
              <span>View Offers</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-xs sm:text-sm text-neutral-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>30-45 Min Avg Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tamper-Proof Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>4.8★ Top Rated Dishes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
