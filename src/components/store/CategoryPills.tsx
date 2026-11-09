"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";

interface CategoryPillsProps {
  categories: Category[];
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
  isLink?: boolean;
}

export function CategoryPills({
  categories,
  selectedSlug,
  onSelect,
  isLink = false,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1">
      {/* "All Menu" Option */}
      {isLink ? (
        <Link
          href="/menu"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
            !selectedSlug
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-white text-charcoal border-edge hover:border-neutral-400"
          }`}
        >
          <span>All Menu</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onSelect && onSelect("")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
            !selectedSlug
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-white text-charcoal border-edge hover:border-neutral-400"
          }`}
        >
          <span>All Dishes</span>
        </button>
      )}

      {categories.map((cat) => {
        const isSelected = selectedSlug === cat.slug;

        if (isLink) {
          return (
            <Link
              key={cat.id}
              href={`/menu#${cat.slug}`}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
                isSelected
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white text-charcoal border-edge hover:border-neutral-400"
              }`}
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-black/10">
                <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" sizes="20px" />
              </div>
              <span>{cat.name}</span>
            </Link>
          );
        }

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect && onSelect(cat.slug)}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all border ${
              isSelected
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-charcoal border-edge hover:border-neutral-400"
            }`}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-black/10">
              <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" sizes="20px" />
            </div>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
