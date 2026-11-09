"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Flame } from "lucide-react";
import { Product, ProductVariant, CartItemAddon } from "@/types";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

interface ProductCustomizerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
}: ProductCustomizerModalProps) {
  const { addToCart } = useCart();

  // Pick first variant by default if variants exist
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  const [selectedAddons, setSelectedAddons] = useState<CartItemAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  if (!isOpen) return null;

  // Toggle addon
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

  // Calculate live total price
  const variantDelta = selectedVariant?.priceDelta || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.basePrice + variantDelta + addonsTotal;
  const totalModalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedVariant,
      selectedAddons,
      quantity,
      instructions.trim() || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        {/* Header / Hero Image */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-900">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <DietaryIcon type={product.dietaryType} size="sm" showLabel />
              {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-amber-300 font-medium bg-black/40 px-2 py-0.5 rounded">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {product.spiceLevel === 1 ? "Medium" : product.spiceLevel === 2 ? "Spicy" : "Extra Hot"}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
              {product.name}
            </h3>
            <p className="text-xs text-neutral-200 line-clamp-2 mt-0.5">
              {product.description}
            </p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-edge">
          {/* Variants / Portion Size */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">
                  Select Portion / Size
                </h4>
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
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
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-primary" : "border-neutral-400"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm">{v.name}</span>
                      </div>
                      <span className="text-xs font-bold text-charcoal">
                        {v.priceDelta > 0
                          ? `+${formatCurrency(v.priceDelta)}`
                          : "Included"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Accompaniments */}
          {product.addons && product.addons.length > 0 && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider">
                  Add Accompaniments & Dips
                </h4>
                <span className="text-[11px] font-medium text-charcoal-muted">
                  Optional
                </span>
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
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-white"
                              : "border-neutral-400"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm">{a.name}</span>
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

          {/* Cooking Instructions Notes */}
          <div className="pt-4 space-y-2">
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
              Special Cooking Instructions (Optional)
            </label>
            <textarea
              rows={2}
              maxLength={150}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, pack gravy separately, extra onions..."
              className="w-full p-3 text-xs border border-edge rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-canvas/30"
            />
            <div className="text-[10px] text-right text-charcoal-muted">
              {instructions.length}/150 characters
            </div>
          </div>
        </div>

        {/* Footer / CTA with Quantity Stepper */}
        <div className="p-4 sm:p-6 border-t border-edge bg-canvas/50 flex items-center justify-between gap-4">
          <div className="flex items-center border border-edge rounded-xl bg-white shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 sm:p-2.5 hover:bg-canvas text-charcoal transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 sm:px-4 text-sm font-bold text-charcoal">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 sm:p-2.5 hover:bg-canvas text-charcoal transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <span>Add to Cart</span>
            <span>{formatCurrency(totalModalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
