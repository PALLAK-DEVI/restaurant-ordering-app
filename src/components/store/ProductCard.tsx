"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Flame, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import { ProductCustomizerModal } from "@/components/store/ProductCustomizerModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasCustomizations =
    (product.variants && product.variants.length > 0) ||
    (product.addons && product.addons.length > 0);

  // Find quantity of this base product in cart (across variants)
  const cartEntries = items.filter((i) => i.productId === product.id);
  const totalInCart = cartEntries.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.isAvailable) return;

    if (hasCustomizations) {
      setIsModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartEntries.length === 1) {
      updateQuantity(cartEntries[0].id, cartEntries[0].quantity - 1);
    } else if (hasCustomizations) {
      // If customized multiple times, open customizer modal or let user manage in cart
      setIsModalOpen(true);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasCustomizations) {
      setIsModalOpen(true);
    } else if (cartEntries.length === 1) {
      updateQuantity(cartEntries[0].id, cartEntries[0].quantity + 1);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <div
        className={`group bg-white rounded-2xl border border-edge overflow-hidden shadow-xs hover:shadow-card transition-all flex flex-col justify-between ${
          !product.isAvailable ? "opacity-75 grayscale-20" : ""
        }`}
      >
        <div>
          {/* Card Top: Food Image & Badges */}
          <div className="relative aspect-4/3 w-full bg-canvas overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <div className="bg-white/95 backdrop-blur-xs p-1 rounded shadow-xs">
                <DietaryIcon type={product.dietaryType} size="sm" />
              </div>
              {product.isBestseller && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Bestseller
                </span>
              )}
            </div>

            {/* Sold out overlay */}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/item/${product.slug}`} className="hover:text-primary transition-colors">
                <h3 className="font-bold text-base sm:text-lg text-charcoal leading-snug line-clamp-1">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Spice & Tags */}
            <div className="flex items-center gap-2 mt-1">
              {product.spiceLevel !== undefined && product.spiceLevel > 0 && (
                <span
                  className="flex items-center text-[11px] text-amber-700 font-medium"
                  title={
                    product.spiceLevel === 1 ? "Mild spice" : product.spiceLevel === 2 ? "Spicy" : "Extra spicy"
                  }
                >
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {product.spiceLevel === 1 ? "Mild" : product.spiceLevel === 2 ? "Spicy" : "Fiery"}
                </span>
              )}
              {product.tags && product.tags.length > 0 && (
                <span className="text-[11px] text-charcoal-muted truncate">
                  • {product.tags.join(", ")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-charcoal-muted line-clamp-2 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Card Footer: Price & Add CTA */}
        <div className="p-4 sm:p-5 pt-0 border-t border-edge/60 flex items-center justify-between gap-3 mt-2">
          <div>
            <div className="text-[10px] text-charcoal-muted uppercase tracking-wider font-semibold">
              {hasCustomizations ? "Starts at" : "Price"}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-charcoal">
              {formatCurrency(product.basePrice)}
            </div>
          </div>

          <div>
            {!product.isAvailable ? (
              <span className="text-xs text-neutral-400 font-semibold px-3 py-1.5 border border-edge rounded-lg">
                Unavailable
              </span>
            ) : totalInCart > 0 && !hasCustomizations ? (
              <div className="flex items-center border-2 border-primary bg-primary text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="p-1.5 sm:p-2 hover:bg-primary-hover transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 sm:px-3 text-xs sm:text-sm font-bold">
                  {totalInCart}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="p-1.5 sm:p-2 hover:bg-primary-hover transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
              >
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5" />
                {hasCustomizations && (
                  <span className="text-[9px] uppercase tracking-tighter opacity-80 block">
                    +
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      {hasCustomizations && (
        <ProductCustomizerModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
