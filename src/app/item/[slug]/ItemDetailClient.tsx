"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import { getProductBySlug } from "@/lib/store";
import { CartItemAddon, ProductVariant } from "@/types";

export default function ItemDetailClient({ slug: initialSlug }: { slug?: string }) {
  const params = useParams();
  const router = useRouter();
  const slug = initialSlug || (params?.slug as string);
  const { addToCart } = useCart();

  const product = useMemo(() => {
    return slug ? getProductBySlug(slug) : undefined;
  }, [slug]);

  // Portion/Variant State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return product?.variants && product.variants.length > 0 ? product.variants[0] : undefined;
  });

  const [selectedAddons, setSelectedAddons] = useState<CartItemAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!product) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-charcoal">Dish Not Found</h2>
          <p className="text-xs text-charcoal-muted mt-2">
            The requested culinary dish could not be located in our menu.
          </p>
          <Link
            href="/menu"
            className="inline-block mt-6 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full"
          >
            Return to Menu
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { id: addon.id, name: addon.name, price: addon.price }];
      }
    });
  };

  const variantDelta = selectedVariant?.priceDelta || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.basePrice + variantDelta + addonsTotal;
  const grandItemTotal = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedVariant,
      selectedAddons,
      quantity,
      instructions.trim() || undefined
    );
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Back link */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full Menu</span>
          </Link>

          <div className="bg-white rounded-3xl border border-edge shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Image */}
            <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-neutral-900 min-h-[300px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <div className="bg-white/95 backdrop-blur-xs p-1.5 rounded-md shadow-xs">
                  <DietaryIcon type={product.dietaryType} size="md" showLabel />
                </div>
                {product.isBestseller && (
                  <span className="bg-amber-500 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Right: Details & Customizer */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {product.spiceLevel === 1 ? "Mild Spice" : product.spiceLevel === 2 ? "Spicy" : "Extra Hot"}
                    </span>
                  )}
                  {product.preparationTimeMinutes && (
                    <span className="flex items-center gap-1 text-xs text-charcoal-muted bg-canvas border border-edge px-2 py-0.5 rounded font-medium">
                      <Clock className="w-3 h-3 text-primary" />
                      {product.preparationTimeMinutes} mins prep
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-charcoal-muted mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Variants / Portion Sizes */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-edge space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        Choose Portion
                      </h4>
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary-light px-2 py-0.5 rounded">
                        Required
                      </span>
                    </div>

                    <div className="space-y-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <label
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 text-charcoal font-semibold shadow-xs"
                                : "border-edge hover:border-neutral-400 text-charcoal-light"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? "border-primary" : "border-neutral-400"
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <span className="text-xs sm:text-sm">{v.name}</span>
                            </div>
                            <span className="text-xs font-bold text-charcoal">
                              {v.priceDelta > 0 ? `+${formatCurrency(v.priceDelta)}` : "Standard"}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {product.addons && product.addons.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-edge space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        Extra Accompaniments & Dips
                      </h4>
                      <span className="text-[10px] text-charcoal-muted">Optional</span>
                    </div>

                    <div className="space-y-2">
                      {product.addons.map((a) => {
                        const isChecked = selectedAddons.some((sel) => sel.id === a.id);
                        return (
                          <label
                            key={a.id}
                            onClick={() => toggleAddon(a)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "border-primary bg-primary/5 text-charcoal font-semibold shadow-xs"
                                : "border-edge hover:border-neutral-400 text-charcoal-light"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isChecked ? "bg-primary border-primary text-white" : "border-neutral-400"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs sm:text-sm">{a.name}</span>
                            </div>
                            <span className="text-xs font-bold text-charcoal">
                              +{formatCurrency(a.price)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-6 pt-6 border-t border-edge space-y-2">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Special Cooking Request
                  </label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Less oil, extra well-done, separate packaging..."
                    className="w-full p-3 text-xs border border-edge rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-canvas/40"
                  />
                </div>
              </div>

              {/* Bottom Actions: Stepper + Add CTA */}
              <div className="pt-6 border-t border-edge flex items-center gap-4">
                <div className="flex items-center border border-edge rounded-xl bg-canvas overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 sm:p-2.5 hover:bg-white text-charcoal transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 sm:px-4 text-sm font-bold text-charcoal">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 sm:p-2.5 hover:bg-white text-charcoal transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAddedFeedback ? "Added to Cart!" : "Add to Order"}</span>
                  </div>
                  <span className="font-extrabold">{formatCurrency(grandItemTotal)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
