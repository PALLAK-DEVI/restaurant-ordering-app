"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Award, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { getStoredSettings } from "@/lib/store";

export default function AboutPage() {
  const settings = getStoredSettings();

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        {/* Hero */}
        <section className="relative bg-neutral-900 text-white py-16 sm:py-24 overflow-hidden border-b border-edge">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"
              alt="Restaurant Dining"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
              Our Culinary Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              The Art of Slow-Simmered Royal Cooking
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Founded on the belief that extraordinary food demands patience, hand-ground spices, and genuine charcoal flame.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs sm:text-sm text-charcoal-light leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Born Out of Passion
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-charcoal leading-snug">
                Where Tradition Meets Modern Culinary Craft
              </h2>
              <p>
                At {settings.name.replace(" (Sample)", "")}, we preserve the time-honored cooking methods of Awadhi and Mughal royal kitchens. We believe that true depth of flavor cannot be rushed or shortcut with artificial pastes.
              </p>
              <p>
                Our signature Dal Makhani simmers for a full 24 hours over gentle charcoal embers, allowing black urad lentils to break down naturally into a creamy, velvety texture infused with churned butter and vine-ripened tomatoes.
              </p>
              <p>
                Our clay tandoors are fueled by natural hardwood lump charcoal, reaching intense scorching temperatures that sear succulent kebabs on the outside while keeping the meat exceptionally tender and juicy inside.
              </p>
            </div>

            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-edge shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
                alt="Slow simmered Dal Makhani"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Core Pillars */}
          <div className="bg-white rounded-3xl border border-edge p-8 sm:p-12 shadow-xs space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Uncompromising Values
              </span>
              <h3 className="text-2xl font-black text-charcoal mt-1">
                Our Kitchen Commitments
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2 text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-primary border border-amber-200 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-charcoal">Real Clay & Coal</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  No electric ovens. Authentic clay tandoor baked naans and kebabs with natural char.
                </p>
              </div>

              <div className="space-y-2 text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-charcoal">Zero Adulteration</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Pure dairy butter, desi ghee, and whole spices freshly roasted and ground in-house.
                </p>
              </div>

              <div className="space-y-2 text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-charcoal">Hygiene Sealed</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Tamper-evident seals, spill-proof insulated packaging, ensuring hot food arrival.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Experience Royal Indian Flavors?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
              Explore our full menu of tandoori starters, curries, and handi-cooked biryanis today.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg transition-all"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
