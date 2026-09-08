import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  logout: () => void;
  login: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
