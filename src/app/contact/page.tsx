"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
  Bike,
  Store,
} from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { MobileBottomNav } from "@/components/store/MobileBottomNav";
import { getStoredSettings } from "@/lib/store";
import { checkRestaurantOpenStatus } from "@/lib/utils";

export default function ContactPage() {
  const settings = getStoredSettings();
  const { isOpen, statusText } = checkRestaurantOpenStatus(settings.operatingHours);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas pb-20 md:pb-16">
        {/* Banner */}
        <section className="bg-white border-b border-edge py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Reach Out to Us
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-charcoal mt-1">
              Contact & Location
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
              Have questions about catering, group orders, or dietary requirements? Our restaurant managers are here to assist you.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Details & Hours (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold text-base text-charcoal">Restaurant Details</h3>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-canvas border border-edge text-xs font-semibold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    <span className="text-charcoal">{statusText}</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-charcoal-light">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-charcoal block">Location</strong>
                      <p className="text-charcoal-muted mt-0.5">{settings.address}</p>
                      <a
                        href={settings.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-bold text-xs mt-1 hover:underline"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <strong className="text-charcoal block">Phone Ordering</strong>
                      <a href={`tel:${settings.phone}`} className="text-primary font-semibold hover:underline">
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <strong className="text-charcoal block">Email</strong>
                      <a href={`mailto:${settings.email}`} className="text-charcoal-muted hover:text-charcoal">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating Hours Table */}
                <div className="pt-4 border-t border-edge space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    Kitchen Timings
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {settings.operatingHours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between py-1 border-b border-edge/60">
                        <span className="font-medium text-charcoal">{schedule.day}</span>
                        <span className="text-charcoal-muted">
                          {schedule.isOpen ? `${schedule.openTime} – ${schedule.closeTime}` : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-edge p-6 sm:p-10 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-charcoal">Send Us an Inquiry</h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    For catering feasts, table inquiries, or private dining celebrations.
                  </p>
                </div>

                {isSent ? (
                  <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-base text-charcoal">Message Sent Successfully!</h4>
                    <p className="text-xs text-charcoal-muted">
                      Thank you for contacting us. A member of our staff will reach out to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sanjeev Kapoor"
                          className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sanjeev@example.com"
                        className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                        Message / Event Requirements *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your event, number of guests, or inquiry..."
                        className="w-full p-3 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
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
