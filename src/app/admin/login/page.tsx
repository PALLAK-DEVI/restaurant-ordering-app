"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("admin@royaltandoor.sample");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated && isAdmin) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await loginAdmin(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed. Check your admin credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto text-white shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Staff & Admin Access</h1>
          <p className="text-xs text-neutral-400">
            Authorized restaurant management, kitchen order queue, and settings portal.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3 bg-neutral-800/80 rounded-2xl border border-neutral-700 text-xs space-y-1">
          <p className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            Demo Credentials Provided:
          </p>
          <div className="font-mono text-[11px] text-neutral-300">
            <p>Email: <span className="text-white font-bold">admin@royaltandoor.sample</span></p>
            <p>Password: <span className="text-white font-bold">admin123</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royaltandoor.sample"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Signing in..." : "Enter Admin Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
