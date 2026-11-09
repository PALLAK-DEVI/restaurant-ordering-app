"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginCustomer, isAuthenticated } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    router.push("/account");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    setIsLoading(true);
    await loginCustomer(phoneOrEmail.trim(), fullName.trim() || undefined);
    setIsLoading(false);
    router.push("/account");
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-canvas flex items-center justify-center p-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-edge p-8 sm:p-10 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-black text-xl">
              RT
            </div>
            <h1 className="text-2xl font-black text-charcoal">Sign In / Register</h1>
            <p className="text-xs text-charcoal-muted">
              Access your order history, saved delivery addresses, and royal loyalty rewards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                Mobile Number or Email *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="+91 98765 43210 or your@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase mb-1">
                Your Name (Optional for New Customers)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-canvas border border-edge rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Signing In..." : "Continue to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-edge text-center space-y-3">
            <p className="text-xs text-charcoal-muted">
              Are you a restaurant team member?
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal hover:text-primary transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Staff & Admin Sign In Portal →</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
