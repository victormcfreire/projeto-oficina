import Parse from "../parseConfig";
import React, { createContext, useContext, useEffect, useState } from "react";
import { login, logout, getCurrentUser } from "../services/authService";

interface AuthContextType {
  user: Parse.User | null;
  loginUser: (email: string, senha: string) => Promise<boolean>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Parse.User | null>(null);

  useEffect(() => {
    const loggedUser = getCurrentUser();
    if (loggedUser) setUser(loggedUser);
  }, []);

  const loginUser = async (email: string, senha: string) => {
    const loggedUser = await login(email, senha);
    if(loggedUser) {
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
