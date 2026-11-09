"use client";

import React, { useState } from "react";
import { Plus, Tag, Trash2, Edit2, CheckCircle2, Clock, X, AlertCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { deleteStoredCoupon, getStoredCoupons, saveStoredCoupon } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStoredCoupons());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [maxDiscountRupees, setMaxDiscountRupees] = useState<number>(100);
  const [minOrderRupees, setMinOrderRupees] = useState<number>(299);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const refreshCoupons = () => {
    setCoupons(getStoredCoupons());
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscountType("percentage");
    setDiscountValue(20);
    setMaxDiscountRupees(100);
    setMinOrderRupees(299);
    setDescription("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountType === "fixed" ? c.discountValue / 100 : c.discountValue);
    setMaxDiscountRupees(c.maxDiscount ? c.maxDiscount / 100 : 0);
    setMinOrderRupees(c.minOrderValue / 100);
    setDescription(c.description);
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      deleteStoredCoupon(id);
      refreshCoupons();
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    const newCoupon: Coupon = {
      id: editingCoupon?.id || `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: discountType === "fixed" ? Math.round(discountValue * 100) : discountValue,
      maxDiscount: maxDiscountRupees > 0 ? Math.round(maxDiscountRupees * 100) : undefined,
      minOrderValue: Math.round(minOrderRupees * 100),
      startsAt: editingCoupon?.startsAt || new Date().toISOString(),
      expiresAt: editingCoupon?.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: editingCoupon?.usageLimit || 5000,
      usageCount: editingCoupon?.usageCount || 0,
      perCustomerLimit: 1,
      isActive,
      description: description.trim(),
    };

    saveStoredCoupon(newCoupon);
    refreshCoupons();
    setIsModalOpen(false);
  };

  return (
    <>
      <AdminHeader
        title="Promotions & Coupons"
        subtitle="Create, configure, and monitor promo discount codes and customer cart savings"
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        }
      />

      <main className="p-6 space-y-6 flex-1">
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Spend</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <div>
                          <strong className="font-mono font-bold text-sm text-charcoal block">
                            {c.code}
                          </strong>
                          <span className="text-[11px] text-charcoal-muted line-clamp-1 max-w-xs">
                            {c.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-charcoal">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `${formatCurrency(c.discountValue)} FLAT`}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal font-medium">
                      {formatCurrency(c.minOrderValue)}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {c.maxDiscount ? formatCurrency(c.maxDiscount) : "No Limit"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-charcoal">
                      {c.usageCount} used
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-charcoal-muted hover:text-primary rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-charcoal-muted hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <h3 className="font-bold text-lg text-charcoal">
                {editingCoupon ? "Edit Coupon" : "Create New Promo Code"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TANDOOR25"
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-mono uppercase font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Rupees (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Value ({discountType === "percentage" ? "%" : "₹"}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Min Order Value (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minOrderRupees}
                    onChange={(e) => setMinOrderRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscountRupees}
                    onChange={(e) => setMaxDiscountRupees(Number(e.target.value))}
                    placeholder="0 for no limit"
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Public Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 25% OFF up to ₹150 on Royal Biryanis"
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Active & Redeemable at Checkout</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-edge">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-xs"
                >
                  Save Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-canvas text-charcoal-muted rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
