"use client";

import { useEffect } from "react";
import { useGameStore, selectLevel } from "@/store/gameStore";
import AvatarSystem from "./Onboarding/AvatarSystem";
import XPBar from "./ui/XPBar";
import { Zap, Target, Book, Dumbbell, Users } from "lucide-react";

// Predefined hot missions to display in the preview
const DAILY_PREVIEWS = [
  { id: "p1", title: "Deep Work Session", xp: 300, type: "Academic" },
  { id: "p2", title: "Iron Core Protocol", xp: 250, type: "Fitness" },
  { id: "p3", title: "Guild Networking", xp: 150, type: "Social" },
];

export default function DashboardView({ initialProfile, allTasks, userId }: any) {
  const profile = useGameStore(s => s.profile);
  const initProfile = useGameStore(s => s.initProfile);
  // Using the global store's acceptMission completes it and awards dynamic XP instantly
  const acceptMission = useGameStore(s => s.acceptMission); 

  useEffect(() => {
    if (!profile && initialProfile) {
      initProfile(initialProfile, allTasks || [], []);
    }
  }, [profile, initialProfile, allTasks, initProfile]);

  const activeProfile = profile ?? initialProfile;
  const currentXP = activeProfile?.xp ?? 0;
  const currentLevel = selectLevel(currentXP);
  
  // Provide safe fallback stats if undefined
  const stats = activeProfile?.stats ?? { academic: 0, fitness: 0, discipline: 0, social: 0 };
  
  // Helper to render an attribute progress bar
  const renderStatBar = (label: string, icon: any, value: number, colorClass: string, barColor: string) => {
    // Map max level conceptually around 5000 XP cap per stat for visual progression
    const percent = Math.min((value / 5000) * 100, 100); 
    return (
      <div className="mb-5 last:mb-0">
        <div className="flex justify-between items-end mb-2">
          <div className={`flex items-center gap-2 ${colorClass} font-orbitron text-sm font-bold uppercase tracking-widest`}>
            {icon} {label}
          </div>
          <span className="text-white font-orbitron font-bold text-sm bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/50">
            {value} XP
          </span>
        </div>
        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
          <div 
            className={`h-full rounded-full ${barColor} shadow-[0_0_12px_currentColor] transition-all duration-1000 ease-out`} 
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen rpg-bg pb-20 p-4 sm:p-6 text-white font-sans max-w-6xl mx-auto">
      
      {/* ── TOP SECTION: User Status & Avatar ── */}
      <section className="glass-panel p-6 md:p-8 mb-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Glow behind Avatar */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative flex-shrink-0 animate-[float_4s_ease-in-out_infinite_alternate]">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center bg-slate-950/80 shadow-[0_0_30px_rgba(0,255,255,0.2)] border-2 border-cyan-500/40 p-1">
            {/* If user has an avatar URL from the avatar selection screen, load it. Otherwise fallback to the 3D AvatarSystem */}
            {activeProfile?.avatar_url ? (
               <div className="w-full h-full rounded-full overflow-hidden relative">
                 <img src={activeProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 ring-4 ring-inset ring-cyan-500/20 rounded-full" />
               </div>
            ) : (
               <AvatarSystem styles={activeProfile?.avatar_styles ?? { skin: "pale", eyes: "cyber", outfit: "default" }} size={130} />
            )}
          </div>
          {/* Level Badge Overlay */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-cyan-400 text-cyan-400 font-orbitron font-black text-sm px-5 py-1 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.6)] z-10 whitespace-nowrap">
            LVL {currentLevel}
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center gap-4 z-10 mt-2 md:mt-0">
          <div className="text-center md:text-left">
            <h1 className="font-orbitron text-3xl md:text-4xl font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-1">
              {activeProfile?.username || "GUEST HERO"}
            </h1>
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              {activeProfile?.path || "Undeclared Class"}
            </p>
          </div>
          <div className="w-full mt-2">
            <XPBar xp={currentXP} />
          </div>
        </div>
      </section>

      {/* Grid wrapper for Middle & Bottom sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ── MIDDLE SECTION: Daily Missions Preview ── */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Target className="text-cyan-400" size={22} />
            <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-slate-100">Daily Missions</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {DAILY_PREVIEWS.map((mission) => (
              <div 
                key={mission.id} 
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded ${
                         mission.type === 'Academic' ? 'text-cyan-400 bg-cyan-950/60' :
                         mission.type === 'Fitness' ? 'text-green-400 bg-green-950/60' :
                         'text-purple-400 bg-purple-950/60'
                    }`}>
                      {mission.type}
                    </span>
                    <span className="text-xs text-slate-400 font-orbitron font-bold">+{mission.xp} XP</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-300 group-hover:text-white transition-colors">{mission.title}</h3>
                </div>
                
                <button 
                  onClick={() => acceptMission({ id: mission.id, title: mission.title, xp: mission.xp, difficulty: "medium" })}
                  className="bg-cyan-500/10 hover:bg-cyan-400 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-400 rounded-xl px-5 py-2.5 font-orbitron text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] active:scale-[0.97]"
                >
                  Complete ✓
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => window.location.href = "/missions"} 
            className="mt-6 text-center text-xs font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest py-3 border border-dashed border-slate-700/50 hover:border-cyan-500/30 rounded-xl transition-all"
          >
            Access Full Mission Log →
          </button>
        </section>

        {/* ── BOTTOM SECTION: Attributes Stats Panel ── */}
        <section className="glass-panel p-6 md:p-8 rounded-3xl flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Zap className="text-yellow-400 animate-pulse" size={22} />
            <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-slate-100">Hero Attributes</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-2 py-4">
             {/* Uses the mapped tracking from store. Once you Complete missions above, these visually fill */}
            {renderStatBar("Academic", <Book size={16} />, stats.academic, "text-cyan-400", "bg-cyan-400")}
            {renderStatBar("Discipline", <Target size={16} />, stats.discipline, "text-purple-400", "bg-purple-400")}
            {renderStatBar("Fitness", <Dumbbell size={16} />, stats.fitness, "text-green-400", "bg-green-400")}
            {renderStatBar("Social", <Users size={16} />, stats.social, "text-yellow-400", "bg-yellow-400")}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Attribute Ranks increase every 5000 XP
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
