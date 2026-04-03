"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { cn } from "@/lib/utils";

// ─── Data Types ───────────────────────────────────────────────────────────────

type MissionType = "Academic" | "Fitness" | "Social" | "Other";
type MissionStatus = "idle" | "active" | "completed";

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: MissionType;
}

const DAILY_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Deep Work Session",
    description: "Complete 2 hours of uninterrupted study or coding.",
    xpReward: 300,
    type: "Academic",
  },
  {
    id: "m2",
    title: "Iron Core Protocol",
    description: "Complete a 45-minute gym session or run 5km.",
    xpReward: 250,
    type: "Fitness",
  },
  {
    id: "m3",
    title: "Guild Networking",
    description: "Connect with a mentor or participate in a group project.",
    xpReward: 150,
    type: "Social",
  },
  {
    id: "m4",
    title: "Base Maintenance",
    description: "Organize your workspace and plan your week.",
    xpReward: 100,
    type: "Other",
  },
];

const TYPE_COLORS: Record<MissionType, { border: string; bg: string; text: string; shadow: string }> = {
  Academic: { border: "border-cyan-400", bg: "bg-cyan-950/30", text: "text-cyan-400", shadow: "shadow-neon-cyan" },
  Fitness: { border: "border-green-400", bg: "bg-green-950/30", text: "text-green-400", shadow: "shadow-[0_0_15px_-3px_rgba(57,255,20,0.4)]" },
  Social: { border: "border-yellow-400", bg: "bg-yellow-950/30", text: "text-yellow-400", shadow: "shadow-neon-gold" },
  Other: { border: "border-purple-400", bg: "bg-purple-950/30", text: "text-purple-400", shadow: "shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MissionsSystem() {
  const [missionStates, setMissionStates] = useState<Record<string, MissionStatus>>({});
  const [xpSimulated, setXpSimulated] = useState(0);
  const [justCompletedXp, setJustCompletedXp] = useState<number | null>(null);

  // Sync with global store if available, or just mock it visually
  const profile = useGameStore((s) => s.profile);
  const baseXP = profile?.xp || xpSimulated;

  const handleAccept = (id: string) => {
    setMissionStates((prev) => ({ ...prev, [id]: "active" }));
  };

  const handleComplete = (mission: Mission) => {
    setMissionStates((prev) => ({ ...prev, [mission.id]: "completed" }));
    
    // Simulate XP addition visually
    setXpSimulated((prev) => prev + mission.xpReward);
    setJustCompletedXp(mission.xpReward);

    // Floating XP text animation cleanup
    setTimeout(() => {
      setJustCompletedXp(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen rpg-bg p-6 sm:p-10 flex flex-col items-center">
      
      {/* ── Header & XP Status ── */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-center mb-10 mt-8 gap-6 z-10 glass-panel-header p-6 rounded-2xl">
        <div>
          <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-tight">
            DAILY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">MISSIONS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Accept and complete tasks to level up your character.</p>
        </div>
        
        <div className="flex flex-col items-end relative">
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Total XP</span>
          <div className="font-orbitron text-4xl font-bold text-cyan-400 flex items-center gap-2">
            {baseXP}
            <span className="text-sm text-cyan-600">XP</span>
          </div>

          {/* Floating XP Animation */}
          {justCompletedXp !== null && (
            <div className="absolute -top-8 right-0 font-orbitron font-bold text-green-400 text-xl animate-[floatUp_2s_ease-out_forwards]">
              +{justCompletedXp} XP 
            </div>
          )}
        </div>
      </div>

      {/* ── Missions List ── */}
      <div className="w-full max-w-3xl space-y-4 z-10">
        {DAILY_MISSIONS.map((mission) => {
          const status = missionStates[mission.id] || "idle";
          const colors = TYPE_COLORS[mission.type];
          
          return (
            <div
              key={mission.id}
              className={cn(
                "relative flex flex-col md:flex-row overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-500",
                "hover:border-slate-700",
                status === "active" && "scale-[1.01] border-slate-600 shadow-lg",
                status === "completed" && "opacity-60 saturate-50"
              )}
            >
              {/* Color coded left bar */}
              <div 
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300", 
                  colors.bg, 
                  status === "active" ? colors.shadow : ""
                )} 
                style={{ backgroundColor: status === "active" ? colors.border.replace('border-', '') : undefined }}
              />

              <div className="p-5 pl-7 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/10", colors.bg, colors.text)}>
                    {mission.type}
                  </span>
                  <span className="font-orbitron font-bold text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/20 text-sm">
                    {mission.xpReward} XP
                  </span>
                </div>
                
                <h3 className={cn(
                  "font-orbitron text-xl font-bold tracking-wide mt-1 transition-colors",
                  status === "completed" ? "text-slate-500 line-through decoration-slate-600" : "text-slate-100"
                )}>
                  {mission.title}
                </h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Action Buttons Area */}
              <div className="p-5 bg-slate-950/40 border-t md:border-t-0 md:border-l border-slate-800/80 flex items-center justify-center min-w-[200px]">
                {status === "idle" && (
                  <button
                    onClick={() => handleAccept(mission.id)}
                    className="w-full btn-ripple py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-orbitron text-sm font-bold tracking-widest transition-all border border-slate-600 hover:border-slate-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    ACCEPT MISSION
                  </button>
                )}

                {status === "active" && (
                  <button
                    onClick={() => handleComplete(mission.id)}
                    className="w-full btn-ripple py-2.5 px-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 font-orbitron text-sm font-bold tracking-widest transition-all border border-green-500/50 hover:border-green-400 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] animate-pulse hover:animate-none"
                  >
                    COMPLETE <span className="font-sans ml-1 text-lg">✓</span>
                  </button>
                )}

                {status === "completed" && (
                  <div className="w-full py-2.5 px-4 rounded-lg bg-slate-900/50 text-slate-500 font-orbitron text-sm font-bold tracking-widest flex justify-center items-center gap-2 border border-slate-800">
                    COMPLETED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
