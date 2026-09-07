import React, { createContext, use, useEffect, useState } from "react";
import { AUTH_ERROR_EVENT } from "../constants/events";
import { STORAGE_KEYS } from "../constants/auth";
import { apiFetch } from "../services/api";

interface AuthContextType {
  token: string | null;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.FARMXNAP_TOKEN),
  );

  const login = (token: string) => {
    localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, token);

    setToken(token);
  };

  /**
   * logout() is for when the user clicks Logout.
   * clearAuth() is for when we already know the user is no longer authenticated.
   */

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.FARMXNAP_TOKEN);

    setToken(null);
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        requiresAuth: true,
      });
    } catch (error) {
      console.error(
        "Logout Error:",
        error instanceof Error ? error.message : "Failed to logout.",
      );
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener(AUTH_ERROR_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_ERROR_EVENT, handleUnauthorized);
    };
  }, []);

  return <AuthContext value={{ token, logout, login }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
