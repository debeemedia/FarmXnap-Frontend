import React, { useEffect, useState } from "react";
import { AUTH_ERROR_EVENT } from "../constants/events";
import { STORAGE_KEYS, UserRole } from "../constants/auth";
import { apiFetch } from "../services/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.FARMXNAP_TOKEN),
  );
  const [userRole, setUserRole] = useState<UserRole | null>(
    () => localStorage.getItem(STORAGE_KEYS.FARMXNAP_USER_ROLE) as UserRole,
  );

  const login = (token: string, userRole: UserRole) => {
    localStorage.setItem(STORAGE_KEYS.FARMXNAP_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.FARMXNAP_USER_ROLE, userRole);

    setToken(token);
    setUserRole(userRole);
  };

  /**
   * logout() is for when the user clicks Logout.
   * clearAuth() is for when we already know the user is no longer authenticated.
   */

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.FARMXNAP_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.FARMXNAP_USER_ROLE);

    setToken(null);
    setUserRole(null);
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

  return (
    <AuthContext value={{ token, userRole, logout, login }}>
      {children}
    </AuthContext>
  );
}
