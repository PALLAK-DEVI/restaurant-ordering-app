"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Sparkles, Filter } from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryPills } from "@/components/store/CategoryPills";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import { getStoredCategories, getStoredProducts } from "@/lib/store";

export default function MenuPage() {
  const categories = useMemo(() => getStoredCategories(), []);
  const allProducts = useMemo(() => getStoredProducts(), []);

  // Filter & Search states
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "bestseller">("recommended");
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Category Filter
      if (selectedCategorySlug) {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // 3. Dietary Filter (Veg / Non-veg)
      if (dietaryFilter === "veg") {
        if (product.dietaryType !== "veg" && product.dietaryType !== "vegan") return false;
      } else if (dietaryFilter === "non-veg") {
        if (product.dietaryType !== "non-veg") return false;
      }

      // 4. Bestseller only toggle
      if (onlyBestsellers && !product.isBestseller) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      if (sortBy === "bestseller") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return a.displayOrder - b.displayOrder;
    });
  }, [allProducts, categories, selectedCategorySlug, searchQuery, dietaryFilter, sortBy, onlyBestsellers]);

  const clearAllFilters = () => {
    setSelectedCategorySlug("");
    setSearchQuery("");
    setDietaryFilter("all");
    setSortBy("recommended");
    setOnlyBestsellers(false);
  };

  const hasActiveFilters =
    selectedCategorySlug || searchQuery || dietaryFilter !== "all" || onlyBestsellers || sortBy !== "recommended";

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-12">
        {/* Top Header / Sticky Category Navigation Banner */}
        <div className="bg-white border-b border-edge sticky top-16 sm:top-20 z-20 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
            {/* Search Bar & Quick Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search curries, biryani, kebabs, naans..."
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-canvas border border-edge rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-charcoal-muted hover:text-charcoal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dietary Chips & Sort Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {/* Veg Toggle */}
                <button
                  type="button"
                  onClick={() => setDietaryFilter(dietaryFilter === "veg" ? "all" : "veg")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all ${
                    dietaryFilter === "veg"
                      ? "bg-green-700 text-white border-green-700 shadow-xs"
                      : "bg-white text-charcoal border-edge hover:border-neutral-400"
                  }`}
                >
                  <DietaryIcon type="veg" size="sm" />
                  <span>Pure Veg</span>
                </button>

                {/* Non-Veg Toggle */}
                <button
                  type="button"
                  onClick={() => setDietaryFilter(dietaryFilter === "non-veg" ? "all" : "non-veg")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all ${
                    dietaryFilter === "non-veg"
                      ? "bg-red-700 text-white border-red-700 shadow-xs"
                      : "bg-white text-charcoal border-edge hover:border-neutral-400"
                  }`}
                >
                  <DietaryIcon type="non-veg" size="sm" />
                  <span>Non-Veg</span>
                </button>

                {/* Bestseller Toggle */}
                <button
                  type="button"
                  onClick={() => setOnlyBestsellers(!onlyBestsellers)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all ${
                    onlyBestsellers
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                      : "bg-white text-charcoal border-edge hover:border-neutral-400"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bestsellers</span>
                </button>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-edge text-charcoal focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shrink-0"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="bestseller">Popularity First</option>
                </select>
              </div>
            </div>

            {/* Horizontal Category Chips */}
            <CategoryPills
              categories={categories}
              selectedSlug={selectedCategorySlug}
              onSelect={(slug) => setSelectedCategorySlug(slug)}
            />
          </div>
        </div>

        {/* Menu Catalog Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-charcoal">
                {selectedCategorySlug
                  ? categories.find((c) => c.slug === selectedCategorySlug)?.name
                  : "All Dishes"}
              </h1>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Showing {filteredProducts.length} authentic preparations
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-edge p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-canvas text-charcoal-muted flex items-center justify-center mx-auto border border-edge">
                <Search className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-lg font-bold text-charcoal">No culinary matches found</h3>
              <p className="text-xs text-charcoal-muted">
                Try adjusting your search terms or clearing filters to explore our full royal menu.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
      <SiteFooter />
    </>
  );
}
