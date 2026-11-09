"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isStaff, isAdmin } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && (!isAuthenticated || (!isStaff && !isAdmin))) {
      // In demo mode, if not signed in, redirect to admin login
      router.push("/admin/login");
    }
  }, [isLoginPage, isAuthenticated, isStaff, isAdmin, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
