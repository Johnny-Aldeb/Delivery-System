import React, { createContext, useState, ReactNode } from "react";

export interface AuthContextType {
  authToken: string;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem("authToken") || "";
  });

  const login = (accessToken: string) => {
    setAuthToken(accessToken);
    localStorage.setItem("authToken", accessToken);
  };

  const logout = () => {
    setAuthToken("");
    localStorage.removeItem("authToken");
  };

  const value = {
    authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
