"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Heart,
  ExternalLink,
} from "lucide-react";
import { getStoredSettings } from "@/lib/store";

export function SiteFooter() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const settings = getStoredSettings();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-14 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg">
                RT
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings.name.replace(" (Sample)", "")}
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {settings.description}
            </p>
            <div className="pt-2">
              <span className="inline-block bg-neutral-800 text-amber-300 text-xs px-2.5 py-1 rounded border border-amber-500/20">
                Sample Restaurant Specification Prototype
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  Full Menu & Combos
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-primary transition-colors">
                  Exclusive Offers & Coupons
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-primary transition-colors">
                  Guest Reviews & Ratings
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Our Culinary Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Location & Contact
                </Link>
              </li>
              <li>
                <Link href="/track/demo" className="hover:text-primary transition-colors">
                  Live Order Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Opening Hours
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {settings.operatingHours.map((schedule) => (
                <li key={schedule.day} className="flex justify-between items-center py-0.5 border-b border-neutral-800/60">
                  <span className="font-medium text-neutral-300">{schedule.day}</span>
                  <span>
                    {schedule.isOpen ? `${schedule.openTime} - ${schedule.closeTime}` : "Closed"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Service Areas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Find Us</h4>
            <div className="space-y-2.5 text-sm text-neutral-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </p>
              <div className="pt-2">
                <p className="text-xs text-neutral-500 font-semibold mb-1 uppercase tracking-wide">
                  Delivery Pincodes Served:
                </p>
                <div className="flex flex-wrap gap-1">
                  {settings.servicePincodes.slice(0, 6).map((pin) => (
                    <span key={pin} className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                      {pin}
                    </span>
                  ))}
                  {settings.servicePincodes.length > 6 && (
                    <span className="text-xs bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
                      +{settings.servicePincodes.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} {settings.name.replace(" (Sample)", "")}. Crafted with{" "}
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for great food.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-neutral-400 hover:text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Staff Dashboard
            </Link>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 flex items-center gap-1"
            >
              Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
