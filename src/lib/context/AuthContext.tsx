"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loginCustomer: (phoneOrEmail: string, name?: string) => Promise<boolean>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AUTH_STORAGE_KEY = "royaltandoor_user_v1";

const DEMO_ADMIN: UserProfile = {
  id: "user-admin-1",
  fullName: "Admin Executive",
  phone: "+91 99999 11111",
  email: "admin@royaltandoor.sample",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read user from localStorage", e);
    }
  }, []);

  const loginCustomer = async (phoneOrEmail: string, name?: string): Promise<boolean> => {
    const isEmail = phoneOrEmail.includes("@");
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: name || (isEmail ? phoneOrEmail.split("@")[0] : "Customer"),
      phone: !isEmail ? phoneOrEmail : "+91 98765 00000",
      email: isEmail ? phoneOrEmail : undefined,
      role: "customer",
      createdAt: new Date().toISOString(),
      savedAddresses: [],
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }
    return true;
  };

  const loginAdmin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Check credentials (supports demo admin credentials or admin email)
    if (
      (email.trim().toLowerCase() === "admin@royaltandoor.sample" && pass === "admin123") ||
      (email.trim().toLowerCase() === "admin" && pass === "admin")
    ) {
      setUser(DEMO_ADMIN);
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ADMIN));
      }
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use demo: admin@royaltandoor.sample / admin123" };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStaff: user?.role === "staff" || user?.role === "admin",
        loginCustomer,
        loginAdmin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
