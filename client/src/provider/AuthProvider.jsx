"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [year, setYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        setLoading(true);

        // Separate calls to prevent one failure from blocking everything
        try {
          const userRes = await api.get("/users/profile");
          setUser(userRes.data.user);
        } catch (err) {
          setUser(null);
        }

        try {
          const yearRes = await api.get("/academic-years/current");
          setYear(yearRes.data);
        } catch (err) {
          console.warn("Current academic year not found");
          setYear(null);
        }
      } catch (error) {
        toast.error("Critical loading error");
        console.error("Critical auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, []);

 const login = async (email, password) => {
  try {
    const res = await api.post("/users/login", { email, password });
    setUser(res.data.user);
    
    toast.success("Admin Login Successful!");
    
    // લોગિન પછી એડમિન ડેશબોર્ડ પર મોકલો
    window.location.href = "/admin/dashboard"; 
    
    return res.data;
  } catch (error) {
    toast.error("Login failed!");
    console.error(error);
  }
};

  const logout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        year,
        setYear,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
