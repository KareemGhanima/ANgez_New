"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/core/supabase/client";

// ─── Data Structures ─────────────────────────────────────────────────────────

export interface UserStats {
  academic: number;
  discipline: number;
  fitness: number;
  social: number;
}

export interface UserData {
  id: string;
  avatar: string;
  level: number;
  currentXP: number;
  totalStats: UserStats;
}

interface AngezContextType {
  user: UserData;
  loading: boolean;
  addXP: (amount: number) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  equipItem: (statBonuses: Partial<UserStats>) => void;
  isLevelingUp: boolean;
  refreshUserData: () => Promise<void>;
}

const DEFAULT_USER: UserData = {
  id: "",
  avatar: "/avatar_medical.png",
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
  const [loading, setLoading] = useState(true);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const supabase = createClient();

  // 1. Sync with Supabase on mount
  useEffect(() => {
    refreshUserData();
  }, []);

  const refreshUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      // Fetch Profile
      const { data: profile, error: pError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Fetch Attributes
      const { data: attrs, error: aError } = await supabase
        .from("attributes")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setUser({
          id: session.user.id,
          avatar: profile.avatar_url || DEFAULT_USER.avatar,
          level: profile.level || 1,
          currentXP: profile.xp || 0,
          totalStats: {
            academic: attrs?.academic || 50,
            discipline: attrs?.discipline || 50,
            fitness: attrs?.fitness || 50,
            social: attrs?.social || 50,
          },
        });
      }
    } catch (err) {
      console.error("Supabase sync failed, using last known state:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── XP & Leveling Logic (Secure) ──────────────────────────────────────────
  const addXP = async (amount: number) => {
    if (!user.id) return;

    // Optimistic Update
    const prevXP = user.currentXP;
    const newXP = prevXP + amount;
    
    // UI Level Up Trigger (Fixed 1000 threshold for demo)
    if (newXP >= 1000) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 4000);
    }

    // Persist to Supabase via RPC
    const { error } = await supabase.rpc('award_xp', { 
      user_id_param: user.id, 
      xp_addition: amount 
    });

    if (!error) {
      // Sync back to get final state (level might have changed in DB)
      await refreshUserData();
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user.id) return;
    setUser(prev => ({ ...prev, avatar: avatarUrl }));
    await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", user.id);
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
    // Note: In a full implementation, we would also update public.inventory in Supabase
  };

  return (
    <AngezContext.Provider value={{ user, loading, addXP, updateAvatar, equipItem, isLevelingUp, refreshUserData }}>
      {children}

      {/* ── Level Up Overlay Ceremony ── */}
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
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
