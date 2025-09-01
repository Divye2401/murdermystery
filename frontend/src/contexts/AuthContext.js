"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true); // Or could check getSession() first to set value

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      setCheckingUser(true);
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
      setCheckingUser(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    checkingUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
