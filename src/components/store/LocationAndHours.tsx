"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, Bike, Store } from "lucide-react";
import { getStoredSettings } from "@/lib/store";
import { checkRestaurantOpenStatus } from "@/lib/utils";

export function LocationAndHours() {
  const settings = getStoredSettings();
  const { isOpen, statusText } = checkRestaurantOpenStatus(settings.operatingHours);

  return (
    <section className="py-16 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-edge shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Details */}
          <div className="p-8 sm:p-12 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Visit & Dine / Takeaway
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
                Location & Kitchen Timings
              </h2>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-canvas border border-edge text-xs font-semibold">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span className="text-charcoal">{statusText}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-charcoal-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-charcoal">Restaurant Address</h4>
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal">Direct Ordering Phone</h4>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xs sm:text-sm text-primary hover:underline font-semibold"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-charcoal">Support Email</h4>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xs sm:text-sm text-charcoal-muted hover:text-charcoal"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-edge flex flex-wrap gap-4">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <span>Get Directions (Maps)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-muted">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-emerald-600" /> Doorstep Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-primary" /> Express Takeaway
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-canvas p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-edge flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-charcoal flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                Kitchen & Delivery Schedule
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm">
                {settings.operatingHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center justify-between py-1.5 border-b border-edge/80"
                  >
                    <span className="font-semibold text-charcoal">{schedule.day}</span>
                    <span
                      className={`font-medium ${
                        schedule.isOpen ? "text-charcoal-muted" : "text-amber-700 font-bold"
                      }`}
                    >
                      {schedule.isOpen ? `${schedule.openTime} – ${schedule.closeTime}` : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white border border-edge text-xs text-charcoal-muted">
              <p>
                <strong className="text-charcoal">Delivery Service Areas:</strong> Orders accepted
                for delivery within 8km radius (Pincodes: {settings.servicePincodes.slice(0, 5).join(", ")}, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
