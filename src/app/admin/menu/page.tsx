"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  X,
  AlertCircle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DietaryIcon } from "@/components/store/DietaryIcon";
import {
  deleteStoredProduct,
  getStoredCategories,
  getStoredProducts,
  saveStoredProduct,
  toggleStoredProductAvailability,
} from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { DietaryType, Product } from "@/types";

export default function AdminMenuPage() {
  const categories = useMemo(() => getStoredCategories(), []);
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("all");

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [basePriceRupees, setBasePriceRupees] = useState<number>(299);
  const [imageUrl, setImageUrl] = useState("");
  const [dietaryType, setDietaryType] = useState<DietaryType>("veg");
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(1);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [tagsInput, setTagsInput] = useState("");

  const refreshProducts = () => {
    setProducts(getStoredProducts());
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setDescription("");
    setBasePriceRupees(299);
    setImageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80");
    setDietaryType("veg");
    setSpiceLevel(1);
    setIsBestseller(false);
    setIsAvailable(true);
    setTagsInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setCategoryId(product.categoryId);
    setDescription(product.description);
    setBasePriceRupees(product.basePrice / 100);
    setImageUrl(product.imageUrl);
    setDietaryType(product.dietaryType);
    setSpiceLevel(product.spiceLevel ?? 1);
    setIsBestseller(product.isBestseller);
    setIsAvailable(product.isAvailable);
    setTagsInput(product.tags.join(", "));
    setIsModalOpen(true);
  };

  const handleToggleAvailability = (id: string) => {
    toggleStoredProductAvailability(id);
    refreshProducts();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to deactivate and remove this dish?")) {
      deleteStoredProduct(id);
      refreshProducts();
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      categoryId,
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: description.trim(),
      basePrice: Math.round(basePriceRupees * 100),
      imageUrl: imageUrl.trim(),
      dietaryType,
      spiceLevel,
      tags: tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isBestseller,
      isAvailable,
      displayOrder: editingProduct?.displayOrder || products.length + 1,
      variants: editingProduct?.variants || [],
      addons: editingProduct?.addons || [],
    };

    saveStoredProduct(productPayload);
    refreshProducts();
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCatId !== "all" && p.categoryId !== selectedCatId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, selectedCatId, searchQuery]);

  return (
    <>
      <AdminHeader
        title="Menu & Dish Management"
        subtitle="Catalog editing, live price updates, portion variants, and stock availability"
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        }
      />

      <main className="p-6 space-y-6 flex-1">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-edge p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-edge rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-charcoal-muted font-medium">Category:</span>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-canvas border border-edge text-charcoal text-xs font-medium cursor-pointer"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dishes Table */}
        <div className="bg-white rounded-2xl border border-edge shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas/80 text-charcoal-muted uppercase text-[10px] font-bold tracking-wider border-b border-edge">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Customizations</th>
                  <th className="py-3 px-4">In Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-canvas shrink-0 border border-edge">
                            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="44px" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <DietaryIcon type={p.dietaryType} size="sm" />
                              <strong className="font-bold text-charcoal text-sm">{p.name}</strong>
                              {p.isBestseller && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 rounded">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-charcoal-muted line-clamp-1 max-w-xs mt-0.5">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-charcoal font-medium">
                        {cat?.name || "Unassigned"}
                      </td>

                      <td className="py-3 px-4 uppercase text-[10px] font-bold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            p.dietaryType === "veg" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.dietaryType}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-extrabold text-charcoal text-sm">
                        {formatCurrency(p.basePrice)}
                      </td>

                      <td className="py-3 px-4 text-charcoal-muted text-[11px]">
                        {p.variants && p.variants.length > 0 ? `${p.variants.length} portions` : "Single size"}
                        {p.addons && p.addons.length > 0 && ` • ${p.addons.length} add-ons`}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.isAvailable
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {p.isAvailable ? "Available" : "Sold Out"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-charcoal-muted hover:text-primary hover:bg-canvas rounded-lg transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-charcoal-muted hover:text-red-600 hover:bg-canvas rounded-lg transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <h3 className="font-extrabold text-lg text-charcoal">
                {editingProduct ? "Edit Dish Details" : "Create New Culinary Dish"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Awadhi Dum Gosht Biryani"
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Base Price (in ₹ Rupees) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={basePriceRupees}
                    onChange={(e) => setBasePriceRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Dietary Classification *
                  </label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl"
                  >
                    <option value="veg">Pure Vegetarian (Green)</option>
                    <option value="non-veg">Non-Vegetarian (Red)</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Menu Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Appetizing description of ingredients and slow-cooking method..."
                  className="w-full p-3 bg-canvas border border-edge rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Spice Level
                  </label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl"
                  >
                    <option value={0}>Mild / Not Spicy</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Spicy</option>
                    <option value={3}>Fiery Hot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Bestseller, Chef Special, Tandoor"
                    className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Available in Kitchen</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-edge">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Dish to Menu
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-canvas text-charcoal-muted rounded-xl font-bold"
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
