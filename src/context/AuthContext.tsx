import { createContext } from "react";
import type { UserRole } from "../constants/auth";

interface AuthContextType {
  token: string | null;
  userRole: UserRole | null;
  logout: () => void;
  login: (token: string, userRole: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
