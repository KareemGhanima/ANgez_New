"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/core/supabase/client";
import { Check, X, Clock, Star, Zap, Shield, Swords, BookOpen, Dumbbell, AlignLeft, BarChart3, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import AvatarSystem from "./Onboarding/AvatarSystem";
import RechartsRadarChart from "./Stats/RadarChart";
import ActivityHeatmap from "./Stats/ActivityHeatmap";
import GoldLock from "./Paywall/GoldLock";
import { useRealtimeProfile } from "@/hooks/useRealtimeProfile";
import { useTranslation } from "react-i18next";

const categoryIcons: Record<string, any> = {
  study: BookOpen,
  gym: Dumbbell,
  "self-improvement": Shield,
  religion: Star,
  default: Swords,
};

const difficultyLabel: Record<string, string> = {
  easy: "EASY",
  medium: "MEDIUM",
  hard: "HARD",
};

export default function DashboardView({ initialProfile, allTasks, userTasks: initialUserTasks, userId }: any) {
  const { t } = useTranslation();
  const { stats: realtimeStats, xp: realtimeXP } = useRealtimeProfile(userId);
  const [profile, setProfile]       = useState(initialProfile);
  const [userTasks, setUserTasks]   = useState(initialUserTasks);
  const [xpFloats, setXpFloats]     = useState<{ id: number; amount: number }[]>([]);
  const floatId = useRef(0);
  const supabase = createClient();

  useEffect(() => {
    // Sync realtime updates
    if (realtimeXP > 0) setProfile((p: any) => ({ ...p, xp: realtimeXP }));
    if (realtimeStats) setProfile((p: any) => ({ ...p, stats: realtimeStats }));
  }, [realtimeXP, realtimeStats]);

  const currentLevel = Math.floor(profile.xp / 1000) + 1;
  const xpIntoCurrentLevel = profile.xp % 1000;
  const xpPercent = Math.min((xpIntoCurrentLevel / 1000) * 100, 100);

  const processedTaskIds = userTasks.map((t: any) => t.task_id);
  const availableTasks   = allTasks.filter((t: any) => !processedTaskIds.includes(t.id)).slice(0, 5);

  const triggerXPFloat = (amount: number) => {
    const id = floatId.current++;
    setXpFloats((prev) => [...prev, { id, amount }]);
    setTimeout(() => setXpFloats((prev) => prev.filter((f) => f.id !== id)), 1100);
  };

  const handleTaskAction = async (task: any, action: string) => {
    setUserTasks((prev: any) => [...prev, { task_id: task.id, status: action }]);

    if (action === "completed") {
      triggerXPFloat(task.xp);
      const newXP = profile.xp + task.xp;
      
      // Level Math
      const newLevel = Math.floor(newXP / 1000) + 1;
      let newStreak  = profile.streak;
      const completedToday = userTasks.some((t: any) => t.status === "completed");
      if (!completedToday) newStreak += 1;

      // Tag-Based Parsing
      let newStats = { ...(profile.stats || { academic: 0, fitness: 0, discipline: 0, social: 0 }) };
      const titleLower = task.title.toLowerCase();
      const pathLower = (profile.path || "").toLowerCase();

      if (titleLower.includes("#academic") || titleLower.includes("study") || pathLower.includes("engineering") || pathLower.includes("medical")) {
         newStats.academic += task.xp;
      } else if (titleLower.includes("#fitness") || titleLower.includes("gym") || titleLower.includes("workout") || pathLower.includes("athletic")) {
         newStats.fitness += task.xp;
      } else if (titleLower.includes("#social")) {
         newStats.social += task.xp;
      } else {
         const split = Math.floor(task.xp / 4);
         newStats.academic += split; newStats.fitness += split; newStats.discipline += split; newStats.social += split;
      }

      const updated = { ...profile, xp: newXP, level: newLevel, streak: newStreak, stats: newStats };
      setProfile(updated);

      await supabase.from("user_tasks").insert({ user_id: userId, task_id: task.id, status: action });
      await supabase.from("users").update({ xp: newXP, level: newLevel, streak: newStreak, stats: newStats }).eq("id", userId);
    } else {
      await supabase.from("user_tasks").insert({ user_id: userId, task_id: task.id, status: action });
    }
  };

  return (
    <div className="min-h-screen pb-16 font-orbitron text-white">
      {/* Animated Background */}
      <div className="rpg-bg" />

      {/* Floating XP numbers */}
      {xpFloats.map((f) => (
        <div key={f.id} className="xp-float fixed z-50 top-20 right-1/2 transform translate-x-1/2 font-black text-neon-cyan pointer-events-none select-none text-4xl" style={{ textShadow: "0 0 20px rgba(0,255,255,0.9)" }}>
          +{f.amount} XP
        </div>
      ))}

      {/* ===== HEADER ===== */}
      <header className="glass-panel-header sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-holo">
        <div className="flex items-center gap-4">
           <Zap className="text-neon-cyan" size={24} />
           <span className="text-xl font-black tracking-[0.2em] text-neon-cyan">ANGEZ <span className="text-white opacity-50 text-sm">LIFE RPG</span></span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-xs text-neon-gold font-bold">{t("dashboard.levels_rewards", "LEVELS & REWARDS")}</span>
              <span className="text-sm">{t("dashboard.level", "Level")} {currentLevel}</span>
           </div>
           <div className="flex gap-2 items-center bg-brand-dark px-3 py-1.5 rounded-full border border-cardBorder">
              <span className="text-xs font-bold tracking-widest">{profile.username || t("dashboard.wanderer", "WANDERER")}</span>
           </div>
           <button onClick={() => window.location.href = "/settings"} className="text-slate-500 hover:text-neon-cyan transition-colors">
            ⚙️
           </button>
        </div>
      </header>

      {/* ===== MAIN 3-COLUMN LAYOUT ===== */}
      <main className="p-4 md:p-6 max-w-[1600px] mx-auto mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: THE HERO'S JOURNEY (AVATAR & RADAR) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-5 relative overflow-hidden group">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-cardBorder pb-2">
                 <Shield size={16} className="text-neon-cyan" /> {t("dashboard.heros_journey", "THE HERO'S JOURNEY")}
              </h2>
              
              <div className="flex flex-col items-center mb-6">
                 <div className="text-[10px] text-neon-cyan tracking-widest uppercase mb-4 text-center">
                    {t("dashboard.personalized_avatar", "Personalized 2D Avatar")}<br/>({profile.path?.split(":")[1] || t("dashboard.wanderer", "Unassigned")})
                 </div>
                 <div className="relative w-48 h-48 rounded-full border-4 border-neon-cyan/30 flex items-center justify-center bg-brand-dark shadow-[0_0_30px_rgba(0,255,255,0.15)] mb-4">
                    <AvatarSystem styles={profile.avatar_styles || { skin: "pale", eyes: "cyber", outfit: "default" }} size={160} className="absolute -bottom-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]" />
                 </div>
                 
                 {/* MANA BAR (XP) */}
                 <div className="w-full px-4 mb-2">
                    <div className="mana-bar-track w-full h-3">
                       <div className="mana-bar-fill" style={{ width: `${xpPercent}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 px-1">
                       <span className="text-[10px] text-neon-cyan">{t("dashboard.xp", "XP")}: {profile.xp.toLocaleString()} / {(currentLevel * 1000).toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="w-full text-center py-2 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent border-y border-neon-cyan/30 mt-2 text-neon-cyan font-bold tracking-widest text-xs uppercase">
                    {t("dashboard.level", "Level")} {currentLevel} &bull; {profile.path?.split(":")[0] || t("dashboard.wanderer", "Wanderer")}
                 </div>
              </div>

              {/* RADAR CHART */}
              <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 mb-2 text-center">
                 <BarChart3 size={16} className="text-neon-green" /> {t("dashboard.radar_chart", "ATTRIBUTE RADAR CHART")}
              </h2>
              <GoldLock>
                 <div className="h-64 w-full">
                    <RechartsRadarChart stats={profile.stats || { academic: 0, fitness: 0, discipline: 0, social: 0 }} />
                 </div>
              </GoldLock>
           </div>
        </div>

        {/* COLUMN 2: DAILY MISSIONS & QUESTS */}
        <div className="lg:col-span-4 glass-panel p-5">
           <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 mb-6 border-b border-cardBorder pb-2 text-center">
              <Swords size={16} className="text-neon-gold" /> {t("dashboard.daily_missions", "DAILY MISSIONS & QUESTS")}
           </h2>

           <div className="flex justify-center gap-2 mb-6">
              <span className="bg-brand-dark border border-cardBorder text-xs px-3 py-1 rounded text-slate-400">{t("dashboard.focus_timers", "FOCUS TIMERS")}</span>
              <button className="bg-brand-dark border border-neon-cyan/50 text-neon-cyan text-xs px-3 py-1 rounded hover:bg-neon-cyan/10">10</button>
              <button className="bg-brand-dark border border-neon-cyan/50 text-neon-cyan text-xs px-3 py-1 rounded hover:bg-neon-cyan/10">25</button>
              <button className="bg-brand-dark border border-neon-cyan/50 text-neon-cyan text-xs px-3 py-1 rounded hover:bg-neon-cyan/10">50 min</button>
           </div>

           <div className="space-y-4">
             {availableTasks.length === 0 ? (
               <div className="text-center p-8 text-neon-cyan/50">{t("dashboard.zone_cleared", "Zone Cleared. Awaiting new intel...")}</div>
             ) : (
               availableTasks.map((task: any) => {
                 const diff = (task.difficulty || "easy").toLowerCase();
                 return (
                   <div key={task.id} className="relative bg-brand-dark/50 border border-cardBorder rounded-lg p-4 overflow-hidden shadow-holo backdrop-blur-sm group hover:border-neon-cyan/50 transition-all">
                      <div className="flex items-start gap-4">
                         <div className="w-12 h-12 rounded-full border border-neon-cyan/30 flex items-center justify-center flex-shrink-0 bg-neon-cyan/5 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                            <Zap size={20} />
                         </div>
                         <div className="flex-1">
                            <h3 className="font-bold text-sm tracking-wide mb-1 leading-tight">{task.title}</h3>
                            <div className="text-neon-cyan font-bold text-xs uppercase tracking-widest shadow-neon-cyan drop-shadow-md">
                               +{task.xp} {t("dashboard.xp", "XP")}
                            </div>
                         </div>
                      </div>
                      <button onClick={() => handleTaskAction(task, "completed")} className="mt-4 w-full py-2 bg-brand-black border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-black tracking-widest text-xs uppercase transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                         {t("dashboard.accept_mission", "Accept Mission")}
                      </button>
                   </div>
                 );
               })
             )}
           </div>

           <ActivityHeatmap streak={profile.streak || 0} xp={profile.xp || 0} />
        </div>

        {/* COLUMN 3: DOPAMINE FEED & DISCOVERY */}
        <div className="lg:col-span-4 glass-panel p-5">
           <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 mb-6 border-b border-cardBorder pb-2 text-center">
              <Video size={16} className="text-neon-pink" /> {t("dashboard.dopamine_feed", "DOPAMINE FEED & DISCOVERY")}
           </h2>
           <GoldLock>
              <div className="space-y-4">
                 {[1,2,3,4].map((i) => (
                    <div key={i} className="flex bg-brand-dark/80 border border-cardBorder rounded-lg overflow-hidden group hover:border-neon-pink/50 transition-all">
                       <div className="w-1/3 bg-slate-800 relative xl:min-h-[100px]">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                             <Video size={14} className="text-white drop-shadow-md" />
                          </div>
                       </div>
                       <div className="w-2/3 p-3 flex flex-col justify-between">
                          <div>
                             <h4 className="text-xs font-bold leading-tight">1-MINUTE METABOLIC BOOST</h4>
                             <p className="text-[10px] text-neon-green font-bold mt-1">+30 {t("dashboard.xp", "XP")}</p>
                          </div>
                          <button className="self-start mt-2 px-3 py-1 text-[10px] border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/20">{t("dashboard.add_to_missions", "Add to Missions")}</button>
                       </div>
                    </div>
                 ))}
              </div>
           </GoldLock>
        </div>

      </main>
    </div>
  );
}
