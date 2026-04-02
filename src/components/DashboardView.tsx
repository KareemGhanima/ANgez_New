"use client";

import { useState, useRef } from "react";
import { createClient } from "@/core/supabase/client";
import { Check, X, Clock, Star, Zap, Shield, Swords, BookOpen, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import AvatarSystem from "./Onboarding/AvatarSystem";
import RechartsRadarChart from "./Stats/RadarChart";
import GoldLock from "./Paywall/GoldLock";

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

const timeEstimates: Record<string, string> = {
  easy: "15m",
  medium: "30m",
  hard: "60m",
};

export default function DashboardView({ initialProfile, allTasks, userTasks: initialUserTasks, userId }: any) {
  const [profile, setProfile]       = useState(initialProfile);
  const [userTasks, setUserTasks]   = useState(initialUserTasks);
  const [xpFloats, setXpFloats]     = useState<{ id: number; amount: number }[]>([]);
  const floatId = useRef(0);
  const supabase = createClient();

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
      const newXP    = profile.xp + task.xp;
      let newLevel   = profile.level;
      let newStreak  = profile.streak;

      if (newXP >= 100) newLevel += Math.floor(newXP / 100);

      const completedToday = userTasks.some((t: any) => t.status === "completed");
      if (!completedToday) newStreak += 1;

      const updated = { ...profile, xp: newXP % 100, level: newLevel, streak: newStreak };
      setProfile(updated);

      await supabase.from("user_tasks").insert({ user_id: userId, task_id: task.id, status: action });
      await supabase.from("users").update({ xp: updated.xp, level: updated.level, streak: updated.streak }).eq("id", userId);
    } else {
      await supabase.from("user_tasks").insert({ user_id: userId, task_id: task.id, status: action });
    }
  };

  const isHighlyActive = profile.streak > 3;
  const xpPercent = Math.min(profile.xp, 100);

  return (
    <div className="min-h-screen pb-16">
      {/* Animated Background */}
      <div className="rpg-bg" />

      {/* Floating XP numbers */}
      {xpFloats.map((f) => (
        <div
          key={f.id}
          className="xp-float fixed z-50 top-20 right-8 font-orbitron text-2xl font-black text-yellow-300 pointer-events-none select-none"
          style={{ textShadow: "0 0 16px rgba(251,191,36,0.9)" }}
        >
          +{f.amount} XP
        </div>
      ))}

      {/* ===== HEADER ===== */}
      <header className="glass-panel-header sticky top-0 z-20 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="avatar-container w-14 h-14 overflow-hidden rounded-full border-2 border-violet-700/50 bg-slate-900 flex items-center justify-center relative">
              <AvatarSystem 
                styles={profile.avatar_styles || { skin: "pale", eyes: "cyber", outfit: "default" }} 
                size={70} 
                className="absolute -bottom-2"
              />
            </div>
          </div>

          {/* Level badge + XP */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="level-badge px-2.5 py-0.5 text-xs text-white">
                LVL {profile.level || 1}
              </div>
              <span className="text-xs font-semibold text-violet-400 font-orbitron uppercase tracking-widest truncate">
                {profile.path ? profile.path.split(":")[0] : (profile.role || "Wanderer")}
              </span>
              <div className="ml-auto streak-badge px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                <Zap size={11} />
                {profile.streak || 0}d
              </div>
            </div>

            {/* XP Bar */}
            <div className="xp-bar-track w-full h-2">
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-violet-400/70 font-orbitron">{profile.xp || 0} XP</span>
              <span className="text-[10px] text-slate-500 font-orbitron">100 XP</span>
            </div>
          </div>

          {/* Settings */}
          <button
            onClick={() => window.location.href = "/settings"}
            title="Settings"
            className="text-slate-500 hover:text-violet-400 transition-colors text-lg ml-1"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="p-4 max-w-lg mx-auto mt-4">
        {/* Radar Chart Panel */}
        <div className="glass-panel mb-6 p-4">
           <h2 className="font-orbitron text-sm font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Zap size={14} /> Power Attributes
           </h2>
           <GoldLock>
             <div className="h-64">
                <RechartsRadarChart 
                   stats={profile.stats || { academic: 0, fitness: 0, discipline: 0, social: 0 }} 
                />
             </div>
             {profile.path && profile.path.includes(":") && (
                <div className="text-center mt-2 text-xs text-slate-400 font-orbitron">
                   Spec: <span className="text-violet-400">{profile.path.split(":")[1]}</span>
                </div>
             )}
           </GoldLock>
        </div>

        <h1 className="font-orbitron text-xl font-bold mb-1 text-white/90 uppercase tracking-widest flex items-center gap-2">
          <Swords size={18} className="text-violet-400" />
          Daily Quests
        </h1>
        <p className="text-xs text-slate-500 mb-5 uppercase tracking-widest">
          Complete quests to earn XP and level up
        </p>

        <div className="space-y-4">
          {availableTasks.length === 0 ? (
            <div className="quest-card p-8 text-center">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-violet-300 font-semibold text-lg font-orbitron">All Quests Cleared!</p>
              <p className="text-slate-500 text-sm mt-2">Come back tomorrow for new challenges.</p>
            </div>
          ) : (
            availableTasks.map((task: any) => {
              const cat    = (task.category || "default").toLowerCase();
              const diff   = (task.difficulty || "easy").toLowerCase();
              const Icon   = categoryIcons[cat] || categoryIcons.default;

              return (
                <div key={task.id} className="quest-card p-4">
                  {/* Top row */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-violet-900/40 border border-violet-700/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white leading-tight">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border font-orbitron", `diff-${diff}`)}>
                          {difficultyLabel[diff] || diff.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {timeEstimates[diff] || "20m"}
                        </span>
                      </div>
                    </div>
                    {/* XP Badge */}
                    <div className="flex-shrink-0 flex flex-col items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-2.5 py-1.5">
                      <Star size={12} className="text-yellow-400" fill="currentColor" />
                      <span className="text-yellow-300 font-orbitron font-bold text-sm leading-none mt-0.5">+{task.xp}</span>
                      <span className="text-[9px] text-yellow-600 font-orbitron">XP</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleTaskAction(task, "completed")}
                      className="btn-complete btn-ripple col-span-2 py-2 rounded-lg flex items-center justify-center gap-1.5 font-bold text-sm"
                    >
                      <Check size={15} /> COMPLETE
                    </button>
                    <button
                      onClick={() => handleTaskAction(task, "later")}
                      className="btn-later btn-ripple py-2 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Clock size={15} />
                    </button>
                    <button
                      onClick={() => handleTaskAction(task, "skipped")}
                      className="btn-skip btn-ripple py-2 rounded-lg flex items-center justify-center gap-1"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => handleTaskAction(task, "interested")}
                      className="btn-interested text-xs"
                    >
                      ♡ Interested — show me more like this
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
