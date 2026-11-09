"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  Store,
  Clock,
  Bike,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getStoredSettings, saveStoredSettings } from "@/lib/store";
import { RestaurantSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(() => getStoredSettings());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(settings.googleMapsUrl);

  // Financials
  const [taxPercentage, setTaxPercentage] = useState(settings.taxPercentage);
  const [packagingRupees, setPackagingRupees] = useState(settings.packagingCharge / 100);
  const [minOrderRupees, setMinOrderRupees] = useState(settings.minimumOrderValue / 100);
  const [deliveryFeeRupees, setDeliveryFeeRupees] = useState(settings.deliveryFee / 100);
  const [freeDeliveryThresholdRupees, setFreeDeliveryThresholdRupees] = useState(
    settings.freeDeliveryThreshold / 100
  );

  // Operations
  const [defaultPrepTime, setDefaultPrepTime] = useState(settings.defaultPrepTimeMinutes);
  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(settings.isDeliveryEnabled);
  const [isPickupEnabled, setIsPickupEnabled] = useState(settings.isPickupEnabled);
  const [pincodesInput, setPincodesInput] = useState(settings.servicePincodes.join(", "));

  // Payments
  const [allowCod, setAllowCod] = useState(settings.allowCod);
  const [allowOnlinePayment, setAllowOnlinePayment] = useState(settings.allowOnlinePayment);
  const [isTestPaymentMode, setIsTestPaymentMode] = useState(settings.isTestPaymentMode);
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings.razorpayKeyId || "");

  // Schedule
  const [operatingHours, setOperatingHours] = useState(settings.operatingHours);

  const handleUpdateSchedule = (dayIndex: number, field: string, value: any) => {
    setOperatingHours((prev) => {
      const copy = [...prev];
      copy[dayIndex] = { ...copy[dayIndex], [field]: value };
      return copy;
    });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: RestaurantSettings = {
      ...settings,
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      taxPercentage: Number(taxPercentage),
      packagingCharge: Math.round(Number(packagingRupees) * 100),
      minimumOrderValue: Math.round(Number(minOrderRupees) * 100),
      deliveryFee: Math.round(Number(deliveryFeeRupees) * 100),
      freeDeliveryThreshold: Math.round(Number(freeDeliveryThresholdRupees) * 100),
      defaultPrepTimeMinutes: Number(defaultPrepTime),
      isDeliveryEnabled,
      isPickupEnabled,
      servicePincodes: pincodesInput
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length === 6),
      allowCod,
      allowOnlinePayment,
      isTestPaymentMode,
      razorpayKeyId: razorpayKeyId.trim(),
      operatingHours,
    };

    saveStoredSettings(updated);
    setSettings(updated);
    setFeedback("Restaurant configuration updated and active immediately!");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <>
      <AdminHeader
        title="Restaurant Business Settings"
        subtitle="Operational parameters, tax rates, delivery zones, timings, and payment toggles"
      />

      <main className="p-6 space-y-6 flex-1 max-w-5xl">
        {feedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSaveAll} className="space-y-8">
          {/* Section 1: Identity & Contact */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <span>Restaurant Identity & Public Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Support Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financials & Delivery Rules */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <Bike className="w-5 h-5 text-primary" />
              <span>Financials, Delivery Zones & Charges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
                <span className="text-[10px] text-charcoal-muted">Standard Indian restaurant GST is 5%</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Packaging Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={packagingRupees}
                  onChange={(e) => setPackagingRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Minimum Order (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minOrderRupees}
                  onChange={(e) => setMinOrderRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Standard Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFeeRupees}
                  onChange={(e) => setDeliveryFeeRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Free Delivery Above (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={freeDeliveryThresholdRupees}
                  onChange={(e) => setFreeDeliveryThresholdRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Avg. Kitchen Prep (Mins)
                </label>
                <input
                  type="number"
                  min="5"
                  value={defaultPrepTime}
                  onChange={(e) => setDefaultPrepTime(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                  Eligible Service Pincodes (Comma separated 6-digit codes)
                </label>
                <input
                  type="text"
                  value={pincodesInput}
                  onChange={(e) => setPincodesInput(e.target.value)}
                  placeholder="122001, 122002, 122003..."
                  className="w-full px-3 py-2 bg-canvas border border-edge rounded-xl font-mono text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                <input
                  type="checkbox"
                  checked={isDeliveryEnabled}
                  onChange={(e) => setIsDeliveryEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span>Enable Home Delivery Option</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                <input
                  type="checkbox"
                  checked={isPickupEnabled}
                  onChange={(e) => setIsPickupEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span>Enable Restaurant Takeaway</span>
              </label>
            </div>
          </div>

          {/* Section 3: Operating Hours Schedule */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Kitchen & Delivery Operating Schedule</span>
            </h3>

            <div className="space-y-2 text-xs">
              {operatingHours.map((schedule, idx) => (
                <div
                  key={schedule.day}
                  className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-canvas border border-edge gap-3"
                >
                  <span className="w-28 font-bold text-charcoal">{schedule.day}</span>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={schedule.isOpen}
                      onChange={(e) => handleUpdateSchedule(idx, "isOpen", e.target.checked)}
                      className="w-3.5 h-3.5 text-primary rounded"
                    />
                    <span>{schedule.isOpen ? "Open" : "Closed"}</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-charcoal-muted">Open:</span>
                    <input
                      type="time"
                      disabled={!schedule.isOpen}
                      value={schedule.openTime}
                      onChange={(e) => handleUpdateSchedule(idx, "openTime", e.target.value)}
                      className="p-1 rounded border border-edge text-xs bg-white disabled:opacity-40"
                    />
                    <span className="text-charcoal-muted">Close:</span>
                    <input
                      type="time"
                      disabled={!schedule.isOpen}
                      value={schedule.closeTime}
                      onChange={(e) => handleUpdateSchedule(idx, "closeTime", e.target.value)}
                      className="p-1 rounded border border-edge text-xs bg-white disabled:opacity-40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Payment Gateways */}
          <div className="bg-white rounded-3xl border border-edge p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-charcoal flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Payment Methods & Gateway Settings</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={allowCod}
                    onChange={(e) => setAllowCod(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Enable Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={allowOnlinePayment}
                    onChange={(e) => setAllowOnlinePayment(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Enable Online Payments (UPI / Card / Netbanking)</span>
                </label>
              </div>

              <div className="p-4 bg-canvas rounded-2xl border border-edge space-y-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-charcoal">
                  <input
                    type="checkbox"
                    checked={isTestPaymentMode}
                    onChange={(e) => setIsTestPaymentMode(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Development / Test Mode (Simulate Online Success Without Real Gateway)</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal uppercase mb-1">
                    Razorpay Key ID (For Live UPI/Card Integration)
                  </label>
                  <input
                    type="text"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    placeholder="rzp_live_..."
                    className="w-full px-3 py-2 bg-white border border-edge rounded-xl font-mono text-xs"
                  />
                  <p className="text-[10px] text-charcoal-muted mt-1">
                    Keep empty to use zero-config simulation mode during development and preview.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-8 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Configuration Settings</span>
          </button>
        </form>
      </main>
    </>
  );
}
