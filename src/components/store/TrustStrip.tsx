import React from "react";
import { Sparkles, ShieldCheck, Flame, Bike } from "lucide-react";

export function TrustStrip() {
  const points = [
    {
      icon: Flame,
      title: "Real Charcoal Tandoor",
      desc: "Smoked in traditional clay ovens",
    },
    {
      icon: Sparkles,
      title: "Pure Desi Ghee & Spices",
      desc: "No artificial food colors or MSG",
    },
    {
      icon: ShieldCheck,
      title: "Hygienic Kitchen",
      desc: "Sanitized prep & sealed containers",
    },
    {
      icon: Bike,
      title: "Thermal Insulated Delivery",
      desc: "Arrives piping hot and fresh",
    },
  ];

  return (
    <section className="bg-white border-b border-edge py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-canvas border border-edge flex items-center justify-center text-primary shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted mt-0.5">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
