import { createContext, useContext } from "react";

// Create Context with default value
export const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => { },
});

// Custom hook to use theme in components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
