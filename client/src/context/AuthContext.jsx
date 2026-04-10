import { createContext, useContext } from "react";

// Create Context
export const AuthContext = createContext({
  user: null,
  setUser: () => { },
  login: async () => { },
  logout: async () => { },
  loading: true,
  year: null,
  setYear: () => { },
});

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
