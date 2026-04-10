import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    schoolName: "Learnsphere Academy",
    logoUrl: "",
    contactEmail: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings");
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.log("Institutional synchronization failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => fetchSettings();

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

