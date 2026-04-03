"use client";

import { lazy, Suspense } from "react";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/core/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Swords, BarChart3, Video, BookOpen, Dumbbell, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarSystem from "./Onboarding/AvatarSystem";
import RechartsRadarChart from "./Stats/RadarChart";
import GoldLock from "./Paywall/GoldLock";
import XPBar from "./ui/XPBar";
import { useGameStore, selectLevel, Task } from "@/store/gameStore";
import { useRealtimeProfile } from "@/hooks/useRealtimeProfile";
import { useRTL } from "@/hooks/useRTL";

// ── Lazy-loaded non-critical panels ──
const ActivityHeatmap = lazy(() => import("./Stats/ActivityHeatmap"));
const DiscoveryFeed   = lazy(() => import("./DiscoveryFeed"));

// ── Category glow map ──
function getGlowClass(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("study") || t.includes("academic") || t.includes("#academic"))
    return "shadow-[0_0_15px_rgba(59,130,246,0.35)] border-blue-500/50";
  if (t.includes("gym") || t.includes("workout") || t.includes("fitness") || t.includes("#fitness"))
    return "shadow-[0_0_15px_rgba(239,68,68,0.35)] border-red-500/50";
  if (t.includes("social") || t.includes("mentorship") || t.includes("#social"))
    return "shadow-[0_0_15px_rgba(168,85,247,0.35)] border-purple-500/50";
  return "shadow-[0_0_12px_rgba(0,255,255,0.15)] border-neon-cyan/30";
}

export default function DashboardView({ initialProfile, allTasks, userTasks: initialUserTasks, userId }: any) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  // ── Zustand selectors ──
  const profile     = useGameStore(s => s.profile);
  const userTasks   = useGameStore(s => s.userTasks);
  const xpFloats    = useGameStore(s => s.xpFloats);
  const initProfile = useGameStore(s => s.initProfile);
  const acceptMission = useGameStore(s => s.acceptMission);
  const skipMission   = useGameStore(s => s.skipMission);
  const setRealtimeProfile = useGameStore(s => s.setRealtimeProfile);

  // ── Realtime Supabase updates → write into store ──
  const { stats: realtimeStats, xp: realtimeXP } = useRealtimeProfile(userId);

  // ── Seed store from server-fetched props on first mount ──
  useEffect(() => {
    if (!profile) {
      initProfile(initialProfile, allTasks, initialUserTasks);
    }
  }, []);

  // ── Sync realtime updates into store ──
  useEffect(() => {
    if (realtimeXP > 0 || realtimeStats) {
      setRealtimeProfile({
        ...(realtimeXP > 0 ? { xp: realtimeXP } : {}),
        ...(realtimeStats ? { stats: realtimeStats } : {}),
      });
    }
  }, [realtimeXP, realtimeStats]);

  // ── Derived values ──
  const activeProfile = profile ?? initialProfile;
  const currentXP     = activeProfile?.xp ?? 0;
  const currentLevel  = selectLevel(currentXP);

  const processedIds    = userTasks.map(t => t.task_id);
  const availableTasks  = (allTasks as Task[]).filter(t => !processedIds.includes(t.id)).slice(0, 5);

  // ── Mission card animation variants ──
  const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
    exit:    { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-screen pb-16 font-orbitron text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="rpg-bg" />

      {/* ── Floating XP Animations ── */}
      <div className="fixed z-50 top-20 left-1/2 -translate-x-1/2 pointer-events-none">
        <AnimatePresence>
          {xpFloats.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="text-4xl font-black text-neon-cyan text-center"
              style={{ textShadow: "0 0 20px rgba(0,255,255,0.9)" }}
            >
              +{f.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── HEADER ── */}
      <header className="glass-panel-header sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-holo">
        <div className="flex items-center gap-4">
          <Zap className="text-neon-cyan" size={24} />
          <span className="text-xl font-black tracking-[0.2em] text-neon-cyan">
            ANGEZ <span className="text-white opacity-50 text-sm">LIFE RPG</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-neon-gold font-bold">{t("dashboard.levels_rewards")}</span>
            <span className="text-sm">{t("dashboard.level")} {currentLevel}</span>
          </div>
          <div className="flex gap-2 items-center bg-brand-dark px-3 py-1.5 rounded-full border border-cardBorder">
            <span className="text-xs font-bold tracking-widest">
              {activeProfile?.username || t("dashboard.wanderer")}
            </span>
          </div>
          <button onClick={() => window.location.href = "/settings"} className="text-slate-500 hover:text-neon-cyan transition-colors">
            ⚙️
          </button>
        </div>
      </header>

      {/* ── MAIN 6-3-3 LAYOUT ── */}
      <main className="p-4 md:p-6 max-w-[1700px] mx-auto mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ════ LEFT WING (Hero's Journey col-span-6) ════ */}
        <div className="lg:col-span-6 flex flex-col h-full gap-6">
          <div className="glass-panel p-5 flex-1 flex flex-col">

            {/* Header row */}
            <div className="flex items-center justify-between border-b border-cardBorder pb-2 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Shield size={16} className="text-neon-cyan" /> {t("dashboard.heros_journey")}
              </h2>
              <span className="text-sm font-bold text-slate-400">بطل الرحلة</span>
            </div>

            {/* Side-by-side: Avatar | Radar */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Avatar half */}
              <div className="flex flex-col items-center justify-center border-r border-cardBorder/50 pr-4">
                <div className="text-[10px] text-neon-cyan tracking-widest uppercase mb-3 text-center">
                  {t("dashboard.personalized_avatar")}<br/>
                  ({activeProfile?.path?.split(":")[1] || t("dashboard.wanderer")})
                </div>

                {/* Avatar circle with glow */}
                <motion.div
                  className="relative w-48 h-48 rounded-full border-4 border-neon-cyan/30 flex items-center justify-center bg-brand-dark shadow-[0_0_30px_rgba(0,255,255,0.15)] mb-4"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,255,255,0.3)" }}
                  transition={{ duration: 0.25 }}
                >
                  <AvatarSystem
                    styles={activeProfile?.avatar_styles ?? { skin: "pale", eyes: "cyber", outfit: "default" }}
                    size={160}
                    className="absolute -bottom-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                  />
                </motion.div>

                {/* Animated XP Bar */}
                <XPBar xp={currentXP} />

                {/* Level badge */}
                <div className="w-full text-center py-2 mt-2 bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent border-y border-neon-cyan/30 text-neon-cyan font-bold tracking-widest text-xs uppercase">
                  {t("dashboard.level")} {currentLevel} &bull; {activeProfile?.path?.split(":")[0] || t("dashboard.wanderer")}
                </div>
              </div>

              {/* Radar half */}
              <div className="flex flex-col items-center relative min-h-[300px]">
                <h2 className="absolute top-0 w-full text-center text-xs font-bold uppercase tracking-widest text-slate-300 z-10">
                  {t("dashboard.radar_chart")}
                </h2>
                <GoldLock>
                  <div className="h-full w-full min-h-[260px] mt-6">
                    <RechartsRadarChart stats={activeProfile?.stats ?? { academic: 0, fitness: 0, discipline: 0, social: 0 }} />
                  </div>
                </GoldLock>
              </div>
            </div>

            {/* Store bar */}
            <div className="mt-4 pt-4 border-t border-cardBorder flex items-center justify-between gap-4">
              <motion.button
                onClick={() => window.location.href = "/armory"}
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(0,255,255,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-brand-dark border border-neon-cyan text-neon-cyan font-black tracking-widest text-sm uppercase rounded shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:bg-neon-cyan hover:text-black transition-colors"
              >
                STORE
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold tracking-widest">AVATAR OUTFITS</div>
                  <div className="text-[10px] text-slate-400">سكنات الشخصية 🔒</div>
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded border border-cardBorder flex items-center justify-center text-2xl">🦺</div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ CENTER: MISSIONS (col-span-3) ════ */}
        <div className="lg:col-span-3 glass-panel p-5 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 mb-4 border-b border-cardBorder pb-2 text-center">
            <Swords size={16} className="text-neon-gold" /> {t("dashboard.daily_missions")}
          </h2>

          {/* Focus timers */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="bg-brand-dark border border-cardBorder text-xs px-3 py-1 rounded text-slate-400">
              {t("dashboard.focus_timers")}
            </span>
            {[10, 25, 50].map(m => (
              <motion.button key={m} whileTap={{ scale: 0.9 }}
                className="bg-brand-dark border border-neon-cyan/50 text-neon-cyan text-xs px-3 py-1 rounded hover:bg-neon-cyan/10">
                {m}
              </motion.button>
            ))}
          </div>

          {/* Mission cards */}
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {availableTasks.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center p-8 text-neon-cyan/50 text-sm">
                  {t("dashboard.zone_cleared")}
                </motion.div>
              ) : (
                availableTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`relative bg-brand-dark/50 border rounded-lg p-4 backdrop-blur-sm transition-colors ${getGlowClass(task.title)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full border border-neon-cyan/30 flex items-center justify-center flex-shrink-0 bg-neon-cyan/5 text-neon-cyan">
                        <Zap size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm leading-tight mb-1 truncate">{task.title}</h3>
                        <Badge variant="outline" className="text-neon-cyan border-neon-cyan/40 text-[10px]">
                          +{task.xp} {t("dashboard.xp")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => acceptMission(task)}
                        className="flex-1 py-2 bg-brand-black border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-black tracking-widest text-xs uppercase transition-all"
                      >
                        {t("dashboard.accept_mission")}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => skipMission(task)}
                        className="px-3 py-2 border border-slate-600 text-slate-400 hover:border-red-500/50 hover:text-red-400 text-xs transition-all rounded"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Lazy-loaded heatmap */}
          <Suspense fallback={<Skeleton className="h-24 mt-4 w-full bg-brand-dark/50" />}>
            <ActivityHeatmap streak={activeProfile?.streak ?? 0} xp={currentXP} />
          </Suspense>
        </div>

        {/* ════ RIGHT: DISCOVERY FEED (col-span-3) ════ */}
        <div className="lg:col-span-3 glass-panel p-5 flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 mb-4 border-b border-cardBorder pb-2 text-center">
            <Video size={16} className="text-neon-pink" /> {t("dashboard.dopamine_feed")}
          </h2>
          <GoldLock>
            <Suspense fallback={
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full bg-brand-dark/50 rounded-lg" />)}
              </div>
            }>
              <DiscoveryFeed />
            </Suspense>
          </GoldLock>
        </div>

      </main>
    </div>
  );
}
