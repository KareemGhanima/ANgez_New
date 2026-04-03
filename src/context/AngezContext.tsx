"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Data Structures ─────────────────────────────────────────────────────────

export interface UserStats {
  academic: number;
  discipline: number;
  fitness: number;
  social: number;
}

export interface UserData {
  avatar: string;
  level: number;
  currentXP: number;
  totalStats: UserStats;
}

interface AngezContextType {
  user: UserData;
  addXP: (amount: number) => void;
  updateAvatar: (avatarUrl: string) => void;
  equipItem: (statBonuses: Partial<UserStats>) => void;
  isLevelingUp: boolean;
}

const DEFAULT_USER: UserData = {
  avatar: "/avatar_medical.png", // Starting default from previous phase
  level: 1,
  currentXP: 0,
  totalStats: {
    academic: 50,
    discipline: 50,
    fitness: 50,
    social: 50,
  },
};

const AngezContext = createContext<AngezContextType | undefined>(undefined);

// ─── Provider Logic ──────────────────────────────────────────────────────────

export const AngezProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Persistence (Prototype layer)
  useEffect(() => {
    const saved = localStorage.getItem("angez_user_state");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("angez_user_state", JSON.stringify(user));
    }
  }, [user, hydrated]);

  // XP & Leveling Logic
  const addXP = (amount: number) => {
    setUser((prev) => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;

      // Check for level threshold (Fixed 1000 for prototype)
      if (newXP >= 1000) {
        newLevel += Math.floor(newXP / 1000);
        newXP = newXP % 1000;
        
        // Trigger Level Up Ceremony
        setIsLevelingUp(true);
        setTimeout(() => setIsLevelingUp(false), 4000); // 4 second ceremony
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
      };
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatar: avatarUrl }));
  };

  const equipItem = (statBonuses: Partial<UserStats>) => {
    setUser((prev) => ({
      ...prev,
      totalStats: {
        academic: prev.totalStats.academic + (statBonuses.academic || 0),
        discipline: prev.totalStats.discipline + (statBonuses.discipline || 0),
        fitness: prev.totalStats.fitness + (statBonuses.fitness || 0),
        social: prev.totalStats.social + (statBonuses.social || 0),
      },
    }));
  };

  return (
    <AngezContext.Provider value={{ user, addXP, updateAvatar, equipItem, isLevelingUp }}>
      {children}

      {/* ── Level Up Overlay Ceremony ── */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-md" />
            <div className="relative text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-8xl font-black text-white drop-shadow-[0_0_40px_rgba(0,255,255,0.8)] font-orbitron italic"
              >
                LEVEL UP!
              </motion.div>
              <div className="text-cyan-400 font-orbitron font-bold tracking-[0.5em] mt-4 text-xl">
                LEGEND CONTINUES
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AngezContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export const useAngez = () => {
  const context = useContext(AngezContext);
  if (context === undefined) {
    throw new Error("useAngez must be used within an AngezProvider");
  }
  return context;
};
