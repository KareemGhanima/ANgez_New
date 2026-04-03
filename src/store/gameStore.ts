/**
 * Angez RPG – Global Game Store
 * Zustand + persist + devtools
 * RULE: No UI-only state here. Only game/domain state.
 */

import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/core/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Stats {
  academic: number;
  fitness: number;
  discipline: number;
  social: number;
}

export interface Profile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  path: string;
  stats: Stats;
  avatar_styles: Record<string, string>;
  subscription_status: boolean;
  language: "en" | "ar" | "fr";
}

export interface Task {
  id: string;
  title: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
}

export interface UserTask {
  task_id: string;
  status: "completed" | "skipped";
}

export interface XPFloat {
  id: number;
  amount: number;
}

// ─── XP Formula ───────────────────────────────────────────────────────────────

const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

export function calcEarnedXP(baseXP: number, difficulty: string, streak: number): number {
  const diff = DIFFICULTY_MULTIPLIER[difficulty] ?? 1.0;
  const streakBonus = Math.min(1 + streak * 0.05, 2.0); // caps at 2×
  return Math.round(baseXP * diff * streakBonus);
}

// ─── Derived selectors (pure functions, call outside of store) ─────────────────

export function selectLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function selectXPPercent(xp: number): number {
  return Math.min((xp % 1000) / 10, 100); // 0–100
}

export function selectXPToNextLevel(xp: number): number {
  const level = selectLevel(xp);
  return level * 1000;
}

// ─── Store State & Actions ─────────────────────────────────────────────────────

interface GameStore {
  // State
  profile: Profile | null;
  allTasks: Task[];
  userTasks: UserTask[];
  xpFloats: XPFloat[];
  _floatCounter: number;

  // Actions – game domain only
  initProfile: (profile: Profile, allTasks: Task[], userTasks: UserTask[]) => void;
  acceptMission: (task: Task) => Promise<void>;
  skipMission: (task: Task) => Promise<void>;
  setRealtimeProfile: (updates: Partial<Profile>) => void;
  setLanguage: (lang: "en" | "ar" | "fr") => Promise<void>;
  removeXPFloat: (id: number) => void;
}

// ─── Store Implementation ───────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        allTasks: [],
        userTasks: [],
        xpFloats: [],
        _floatCounter: 0,

        initProfile: (profile, allTasks, userTasks) => {
          set({ profile, allTasks, userTasks });
        },

        acceptMission: async (task) => {
          const { profile, userTasks, _floatCounter } = get();
          if (!profile) return;

          // ── Optimistic update snapshot for rollback ──
          const snapshot = { profile: { ...profile }, userTasks: [...userTasks] };

          // ── Calculate earned XP with formula ──
          const earned = calcEarnedXP(task.xp, task.difficulty ?? "easy", profile.streak);

          // ── Tag-based stat routing ──
          const title = task.title.toLowerCase();
          const path  = (profile.path ?? "").toLowerCase();
          const stats: Stats = { ...(profile.stats ?? { academic: 0, fitness: 0, discipline: 0, social: 0 }) };

          if (title.includes("#academic") || title.includes("study") || path.includes("engineering") || path.includes("medical")) {
            stats.academic = (stats.academic ?? 0) + earned;
          } else if (title.includes("#fitness") || title.includes("gym") || title.includes("workout") || path.includes("athletic")) {
            stats.fitness = (stats.fitness ?? 0) + earned;
          } else if (title.includes("#social") || title.includes("mentorship")) {
            stats.social = (stats.social ?? 0) + earned;
          } else {
            const split = Math.floor(earned / 4);
            stats.academic   = (stats.academic   ?? 0) + split;
            stats.fitness    = (stats.fitness    ?? 0) + split;
            stats.discipline = (stats.discipline ?? 0) + split;
            stats.social     = (stats.social     ?? 0) + split;
          }

          const newXP      = profile.xp + earned;
          const newLevel   = selectLevel(newXP);
          const newStreak  = userTasks.some(t => t.status === "completed") ? profile.streak : profile.streak + 1;
          const floatId    = _floatCounter + 1;

          // ── Apply optimistic state ──
          set({
            profile: { ...profile, xp: newXP, level: newLevel, streak: newStreak, stats },
            userTasks: [...userTasks, { task_id: task.id, status: "completed" }],
            xpFloats: [...get().xpFloats, { id: floatId, amount: earned }],
            _floatCounter: floatId,
          });

          // Auto-remove float after 1.1s
          setTimeout(() => get().removeXPFloat(floatId), 1100);

          // ── Background Supabase sync ──
          try {
            const supabase = createClient();
            await supabase.from("user_tasks").insert({ user_id: profile.id, task_id: task.id, status: "completed" });
            await supabase.from("users").update({
              xp: newXP, level: newLevel, streak: newStreak, stats,
            }).eq("id", profile.id);
          } catch (err) {
            console.error("[gameStore] acceptMission rollback:", err);
            // ── Rollback on failure ──
            set({ profile: snapshot.profile, userTasks: snapshot.userTasks });
          }
        },

        skipMission: async (task) => {
          const { profile, userTasks } = get();
          if (!profile) return;

          const snapshot = { userTasks: [...userTasks] };
          set({ userTasks: [...userTasks, { task_id: task.id, status: "skipped" }] });

          try {
            const supabase = createClient();
            await supabase.from("user_tasks").insert({ user_id: profile.id, task_id: task.id, status: "skipped" });
          } catch {
            set({ userTasks: snapshot.userTasks });
          }
        },

        setRealtimeProfile: (updates) => {
          const { profile } = get();
          if (!profile) return;
          set({ profile: { ...profile, ...updates } });
        },

        setLanguage: async (lang) => {
          const { profile } = get();
          // Optimistic local update
          if (profile) set({ profile: { ...profile, language: lang } });

          // Persist to Supabase + localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("angez_lang", lang);
          }

          if (profile) {
            try {
              const supabase = createClient();
              await supabase.from("users").update({ language: lang }).eq("id", profile.id);
            } catch (e) {
              console.warn("[gameStore] Language sync failed silently:", e);
            }
          }
        },

        removeXPFloat: (id) => {
          set(state => ({ xpFloats: state.xpFloats.filter(f => f.id !== id) }));
        },
      }),
      {
        name: "angez-game-store",
        storage: createJSONStorage(() => {
          // Safe storage wrapper: falls back to memory if localStorage unavailable
          if (typeof window === "undefined") return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
          return localStorage;
        }),
        // Only persist lightweight identity data — not full task lists (refetched server-side)
        partialize: (state) => ({
          profile: state.profile,
          userTasks: state.userTasks,
        }),
      }
    ),
    { name: "Angez Game Store" }
  )
);
