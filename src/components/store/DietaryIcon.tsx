import React from "react";
import { DietaryType } from "@/types";

interface DietaryIconProps {
  type: DietaryType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function DietaryIcon({ type, size = "md", showLabel = false }: DietaryIconProps) {
  const isVeg = type === "veg" || type === "vegan";
  const sizeClasses = {
    sm: "w-3.5 h-3.5 p-0.5",
    md: "w-4 h-4 p-0.5",
    lg: "w-5 h-5 p-1",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const borderClass = isVeg ? "border-green-600" : "border-red-600";
  const dotClass = isVeg ? "bg-green-600 rounded-full" : "bg-red-600 rounded-full";

  return (
    <div className="inline-flex items-center gap-1.5" title={isVeg ? "Vegetarian" : "Non-Vegetarian"}>
      <span
        className={`inline-flex items-center justify-center border-2 rounded-sm ${borderClass} ${sizeClasses[size]}`}
      >
        <span className={`${dotSizes[size]} ${dotClass}`} />
      </span>
      {showLabel && (
        <span className={`text-xs font-medium uppercase tracking-wider ${isVeg ? "text-green-700" : "text-red-700"}`}>
          {type === "veg" ? "Pure Veg" : type === "vegan" ? "Vegan" : "Non-Veg"}
        </span>
      )}
    </div>
  );
}
