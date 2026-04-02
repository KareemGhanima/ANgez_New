"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeSettings {
  primary: string;
  accent: string;
  bgColor: string;
  fontSize: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
}

const defaultTheme: ThemeSettings = {
  primary: "#8b5cf6",
  accent: "#10b981",
  bgColor: "#0f172a",
  fontSize: "16px"
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("angez_theme");
    if (saved) {
      setTheme(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--bg-color", theme.bgColor);
    document.documentElement.style.setProperty("--font-size-base", theme.fontSize);
  }, [theme, mounted]);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);
    localStorage.setItem("angez_theme", JSON.stringify(updated));
  };

  return <ThemeContext.Provider value={{ theme, updateTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
