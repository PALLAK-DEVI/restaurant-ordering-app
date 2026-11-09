"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { HeroBanner } from "@/components/store/HeroBanner";
import { TrustStrip } from "@/components/store/TrustStrip";
import { CategoryPills } from "@/components/store/CategoryPills";
import { ProductCard } from "@/components/store/ProductCard";
import { OffersCarousel } from "@/components/store/OffersCarousel";
import { WhyChooseUs } from "@/components/store/WhyChooseUs";
import { ReviewsPreview } from "@/components/store/ReviewsPreview";
import { LocationAndHours } from "@/components/store/LocationAndHours";
import {
  getStoredCategories,
  getStoredCoupons,
  getStoredProducts,
  getStoredReviews,
} from "@/lib/store";

export default function HomePage() {
  const categories = useMemo(() => getStoredCategories(), []);
  const products = useMemo(() => getStoredProducts(), []);
  const coupons = useMemo(() => getStoredCoupons(), []);
  const reviews = useMemo(() => getStoredReviews(), []);

  // Filter 4-8 bestsellers
  const bestsellers = useMemo(() => {
    return products.filter((p) => p.isBestseller).slice(0, 8);
  }, [products]);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pb-16 md:pb-0">
        {/* 1. Hero */}
        <HeroBanner />

        {/* 2. Trust Strip */}
        <TrustStrip />

        {/* 3. Category Shortcuts */}
        <section className="py-12 bg-white border-b border-edge">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Explore by Course
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-charcoal">
                  Our Culinary Offerings
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CategoryPills categories={categories} isLink />
          </div>
        </section>

        {/* 4. Chef's Bestsellers */}
        <section className="py-16 bg-canvas border-b border-edge">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Loved & Ordered
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-charcoal mt-1">
                  Royal Signature Bestsellers
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                  Our patrons' highest-rated tandoori kebabs, rich gravies, and fragrant dum biryanis.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <span>See all {products.length} dishes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Products Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Active Offers & Promos */}
        <section className="py-16 bg-white border-b border-edge">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Limited Time Savings
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-charcoal mt-1">
                  Deals & Special Offers
                </h2>
              </div>
              <Link
                href="/offers"
                className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>All Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <OffersCarousel coupons={coupons} />
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <WhyChooseUs />

        {/* 7. Customer Testimonials */}
        <ReviewsPreview reviews={reviews} />

        {/* 8. Location & Hours */}
        <LocationAndHours />
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
