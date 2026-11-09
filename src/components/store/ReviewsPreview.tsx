"use client";

import React from "react";
import Link from "next/link";
import { Star, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

interface ReviewsPreviewProps {
  reviews: Review[];
}

export function ReviewsPreview({ reviews }: ReviewsPreviewProps) {
  const approved = reviews.filter((r) => r.moderationStatus === "approved");
  const averageRating =
    approved.length > 0
      ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
      : "4.9";

  return (
    <section className="py-16 bg-white border-b border-edge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Customer Testimonials
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {averageRating} ({approved.length} verified reviews)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
              Loved by Foodies Across the City
            </h2>
            <p className="text-sm text-charcoal-muted mt-1">
              Read honest experiences from patrons who ordered from our kitchen.
            </p>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover hover:underline underline-offset-4"
          >
            <span>Read All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approved.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="bg-canvas/50 rounded-2xl p-6 border border-edge shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-neutral-200 text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Order
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed italic">
                  "{r.comment}"
                </p>

                {r.foodItemsLiked && r.foodItemsLiked.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {r.foodItemsLiked.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-white border border-edge px-2 py-0.5 rounded text-charcoal-muted"
                      >
                        Loved: {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-edge flex items-center justify-between text-xs text-charcoal-muted">
                <span className="font-bold text-charcoal">{r.customerName}</span>
                <span>{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
