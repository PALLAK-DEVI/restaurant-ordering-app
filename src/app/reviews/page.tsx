"use client";

import React, { useMemo, useState } from "react";
import {
  Star,
  CheckCircle2,
  MessageSquarePlus,
  X,
  AlertCircle,
  ThumbsUp,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import {
  createStoredReview,
  getOrderByIdOrToken,
  getStoredOrders,
  getStoredReviews,
} from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Review } from "@/types";

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState<Review[]>(() => getStoredReviews());
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Form states
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [foodItemsInput, setFoodItemsInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const approvedReviews = useMemo(() => {
    return reviewsList.filter((r) => r.moderationStatus === "approved");
  }, [reviewsList]);

  // Aggregate ratings
  const totalCount = approvedReviews.length;
  const avgRating =
    totalCount > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : "5.0";

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [approvedReviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanOrderNum = orderNumberInput.trim().toUpperCase();
    if (!cleanOrderNum) {
      setFormError("Please enter your Order ID / Number to verify your purchase.");
      return;
    }

    // Verify order exists and is delivered
    const foundOrder = getOrderByIdOrToken(cleanOrderNum);
    if (!foundOrder) {
      setFormError(
        `Order "${cleanOrderNum}" could not be verified. Please check the order number from your receipt or confirmation email.`
      );
      return;
    }

    if (foundOrder.status !== "delivered") {
      setFormError(
        `Order status is "${foundOrder.status}". Reviews can only be submitted once the food is delivered.`
      );
      return;
    }

    // Check if review already exists for this order
    const existing = reviewsList.find((r) => r.orderId === foundOrder.id || r.orderId === foundOrder.orderNumber);
    if (existing) {
      setFormError("A review has already been submitted for this order. Thank you!");
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId: foundOrder.orderNumber,
      customerName: nameInput.trim() || foundOrder.guestName || "Verified Guest",
      rating: ratingInput,
      comment: commentInput.trim(),
      moderationStatus: "approved", // auto-approve verified customer in demo mode
      createdAt: new Date().toISOString(),
      foodItemsLiked: foodItemsInput
        ? foodItemsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : foundOrder.items.slice(0, 2).map((i) => i.productNameSnapshot),
    };

    createStoredReview(newReview);
    setReviewsList((prev) => [newReview, ...prev]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsSubmitOpen(false);
      setOrderNumberInput("");
      setNameInput("");
      setCommentInput("");
      setFoodItemsInput("");
    }, 2000);
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        {/* Banner */}
        <section className="bg-white border-b border-edge py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Patron Satisfaction
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-charcoal mt-1">
                  Customer Ratings & Experiences
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
                  Real feedback from food lovers who enjoyed our authentic slow-cooked dum curries and charcoal kebabs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </section>

        {/* Rating Breakdown & Reviews Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary Card */}
            <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs h-fit space-y-6">
              <div className="text-center pb-6 border-b border-edge">
                <div className="text-5xl font-black text-charcoal tracking-tight">
                  {avgRating}
                </div>
                <div className="flex justify-center items-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(Number(avgRating))
                          ? "fill-amber-400 text-amber-400"
                          : "fill-neutral-200 text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-charcoal-muted">
                  Based on {totalCount} verified dining reviews
                </p>
              </div>

              {/* Star Distribution Bars */}
              <div className="space-y-2 text-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
                  const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 font-bold text-charcoal flex items-center gap-1">
                        {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-canvas rounded-full overflow-hidden border border-edge/60">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-medium text-charcoal-muted">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-edge text-xs text-charcoal-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Only customers with completed orders can submit ratings.</span>
              </div>
            </div>

            {/* Reviews Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-charcoal mb-2">
                All Verified Reviews ({approvedReviews.length})
              </h3>

              {approvedReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-edge p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-charcoal">{r.customerName}</h4>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified Order
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-neutral-200 text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-charcoal-muted">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                    {r.comment}
                  </p>

                  {r.foodItemsLiked && r.foodItemsLiked.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.foodItemsLiked.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-canvas border border-edge px-2 py-0.5 rounded text-charcoal-muted flex items-center gap-1"
                        >
                          <ThumbsUp className="w-2.5 h-2.5 text-primary" /> {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Review Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSubmitOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <div>
                <h3 className="text-lg font-bold text-charcoal">Submit Order Review</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Share your experience with our kitchen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-canvas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-charcoal">Review Published!</h4>
                <p className="text-xs text-charcoal-muted">
                  Thank you for your valuable feedback. It helps us maintain our royal culinary standards.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Order Number / ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderNumberInput}
                    onChange={(e) => setOrderNumberInput(e.target.value)}
                    placeholder="e.g. ORD-2026-8921"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl font-mono text-xs uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-charcoal-muted mt-1">
                    Found on your order confirmation page or tracking screen.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1.5">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingInput
                              ? "fill-amber-400 text-amber-400"
                              : "fill-neutral-200 text-neutral-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-charcoal ml-2">
                      {ratingInput} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Comments / Dining Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="How was the flavor, delivery speed, and food temperature?"
                    className="w-full p-3 bg-canvas border border-edge rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Dishes You Loved (Optional)
                  </label>
                  <input
                    type="text"
                    value={foodItemsInput}
                    onChange={(e) => setFoodItemsInput(e.target.value)}
                    placeholder="e.g. Butter Chicken, Garlic Naan"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-md transition-all"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
