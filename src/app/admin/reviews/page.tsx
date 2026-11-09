"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, EyeOff, Trash2, Check, MessageSquare, ShieldCheck } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredReviews, updateStoredReviewStatus } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());

  const handleUpdateStatus = (id: string, status: Review["moderationStatus"]) => {
    const updated = updateStoredReviewStatus(id, status);
    setReviews(updated);
  };

  return (
    <>
      <AdminHeader
        title="Review Moderation"
        subtitle="Moderate patron feedback, ratings, and verified dining testimonials"
      />

      <main className="p-6 space-y-6 flex-1">
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Customer & Order</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Comment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal">
                      {r.customerName}
                      {r.orderId && (
                        <span className="text-[10px] font-mono text-charcoal-muted block">
                          Order #{r.orderId}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-charcoal-light leading-relaxed line-clamp-2">
                        "{r.comment}"
                      </p>
                      {r.foodItemsLiked && r.foodItemsLiked.length > 0 && (
                        <div className="text-[10px] text-primary font-medium mt-1">
                          Items: {r.foodItemsLiked.join(", ")}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          r.moderationStatus === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.moderationStatus === "hidden"
                            ? "bg-neutral-100 text-neutral-600"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.moderationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {r.moderationStatus !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, "approved")}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          title="Approve Review"
                        >
                          Approve
                        </button>
                      )}
                      {r.moderationStatus !== "hidden" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, "hidden")}
                          className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-charcoal rounded-lg text-xs font-semibold"
                          title="Hide Review"
                        >
                          Hide
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
