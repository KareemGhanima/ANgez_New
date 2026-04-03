"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function LevelSystem() {
  // Start the user at Level 12 with some spare XP (11,000 XP total = Level 12)
  const [totalXP, setTotalXP] = useState(11500);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Derived state
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const currentXpInLevel = totalXP % 1000;
  const progressPercent = (currentXpInLevel / 1000) * 100;

  // Track previous level to detect level ups
  const prevLevelRef = useRef(currentLevel);

  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      // Level Up detected
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000); // Hide after 3 seconds
    }
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  const addXP = () => {
    setTotalXP((prev) => prev + 250);
  };

  return (
    <div className="min-h-screen rpg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* ── Main Panel ── */}
      <div className="glass-panel p-8 md:p-12 w-full max-w-2xl relative z-10 flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="font-orbitron text-2xl font-black text-slate-300 tracking-widest uppercase mb-12">
          Character Status
        </h2>

        {/* Level Badge Wrapper (Glows intensely during Level Up) */}
        <div className="relative mb-10">
          
          {/* Pulsing glow aura on Level Up */}
          {showLevelUp && (
            <div className="absolute inset-0 scale-150 bg-cyan-400/20 blur-3xl rounded-full animate-pulse z-0" />
          )}

          <div 
            className={cn(
              "level-badge relative z-10 flex flex-col items-center justify-center rounded-3xl p-6 min-w-[140px]",
              "border-2 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl transition-all duration-500",
              showLevelUp ? "border-cyan-400 scale-110 shadow-[0_0_50px_rgba(0,255,255,0.8)]" : "border-slate-700 hover:border-slate-500"
            )}
          >
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Level</span>
            <span className={cn(
              "font-orbitron text-6xl font-black",
              showLevelUp ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-300" : "text-white"
            )}>
              {currentLevel}
            </span>
          </div>

          {/* Floating Level Up Text */}
          {showLevelUp && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 font-orbitron font-black text-3xl text-cyan-400 tracking-widest animate-[floatUp_2s_ease-out_forwards] whitespace-nowrap drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
              LEVEL UP!
            </div>
          )}
        </div>

        {/* ── XP Progress Bar ── */}
        <div className="w-full space-y-3 mb-10">
          <div className="flex justify-between items-end px-1">
            <span className="font-orbitron text-sm text-cyan-400 uppercase tracking-widest font-bold">
              Progress
            </span>
            <span className="font-orbitron font-bold text-slate-300">
              <span className="text-white">{currentXpInLevel}</span> / 1000 XP
            </span>
          </div>
          
          <div className="mana-bar-track h-8 md:h-10 w-full rounded-2xl bg-slate-900/60 p-1 backdrop-blur-md">
            <div 
              className="mana-bar-fill h-full rounded-xl transition-all relative overflow-hidden"
              style={{ width: `${Math.max(progressPercent, 2)}%` }} // keep at least 2% so it's visible 
            >
              <div className="absolute inset-0 bg-white/20 w-1/2 transform skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          
          <p className="text-right text-xs text-slate-500 font-bold uppercase tracking-wider">
            {1000 - currentXpInLevel} XP to Next Level
          </p>
        </div>

        {/* ── Simulation Button ── */}
        <button
          onClick={addXP}
          className="group relative px-8 py-4 bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 rounded-xl font-orbitron font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all overflow-hidden"
        >
          {/* Hover Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          
          <span className="relative z-10 flex items-center gap-2">
            Simulate 
            <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded text-xs ml-1 font-black">
              +250 XP
            </span>
          </span>
        </button>

      </div>

      {/* ── Level Up Screen Particles Overlay ── */}
      {showLevelUp && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-[float_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                boxShadow: "0 0 10px rgba(0,255,255,0.8)"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
