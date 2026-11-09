import React from "react";
import { Award, Clock, HeartHandshake, ShieldCheck } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    {
      icon: Award,
      title: "Generations-Old Royal Recipes",
      desc: "Our gravies and marinades are prepared with traditional stone-ground spices, retaining centuries of royal Awadhi & Mughal flavor heritage.",
    },
    {
      icon: Clock,
      title: "24-Hour Charcoal Slow Simmering",
      desc: "Our signature Dal Makhani and gravies cook overnight on gentle embers to extract deep smokiness and velvety natural texture.",
    },
    {
      icon: ShieldCheck,
      title: "5-Star Hygiene & Sealed Boxes",
      desc: "Every order is packed in food-grade, leak-proof, microwave-safe containers with seal-intact security tape.",
    },
    {
      icon: HeartHandshake,
      title: "Transparent & Honest Pricing",
      desc: "No hidden charges. Clear itemization of subtotal, restaurant GST (5%), and packaging with transparent delivery rules.",
    },
  ];

  return (
    <section className="py-16 bg-canvas border-b border-edge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            The Royal Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
            Why Food Lovers Choose Us
          </h2>
          <p className="text-sm text-charcoal-muted mt-2">
            Every dish that leaves our tandoor is crafted with culinary devotion and genuine ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-edge shadow-xs hover:shadow-card transition-all flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-charcoal mb-2">
                  {b.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
