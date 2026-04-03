"use client";

import React from "react";
import { useAngez } from "@/context/AngezContext";
import GameCard from "@/components/ui/GameCard";
import { Zap, Target, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function IntegrationDashboard() {
  const { user, addXP } = useAngez();

  // Stats mapped for display
  const statList = [
    { label: "Academic", value: user.totalStats.academic, color: "text-cyan-400" },
    { label: "Discipline", value: user.totalStats.discipline, color: "text-purple-400" },
    { label: "Fitness", value: user.totalStats.fitness, color: "text-green-400" },
    { label: "Social", value: user.totalStats.social, color: "text-yellow-400" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      
      {/* ── Welcome Header ── */}
      <header>
        <h1 className="font-orbitron font-black text-4xl text-white tracking-widest mb-2">
          COMMAND <span className="text-cyan-400">CENTER</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
          Welcome back, Hero. Your journey continues.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ── Level Status Card ── */}
        <GameCard variant="cyan" className="md:col-span-1 flex flex-col items-center justify-center py-10">
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Current Standing</div>
          <div className="text-7xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {user.level}
          </div>
          <div className="text-cyan-400 font-bold uppercase tracking-widest text-xs mt-2">Level Rank</div>
        </GameCard>

        {/* ── XP & Quick Actions ── */}
        <GameCard variant="purple" className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="font-orbitron font-bold text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" /> Progression Sync
            </h2>
            <span className="text-xs font-bold text-slate-500">{user.currentXP} / 1000 XP</span>
          </div>

          {/* Progress Bar Display */}
          <div className="h-6 w-full bg-slate-900/50 rounded-full border border-white/5 p-1">
             <motion.div 
               className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.3)]"
               initial={false}
               animate={{ width: `${(user.currentXP / 1000) * 100}%` }}
               transition={{ type: "spring", stiffness: 50 }}
             />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={() => addXP(250)}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 rounded-xl font-orbitron uppercase tracking-widest text-xs transition-all active:scale-95 shadow-[0_5px_15px_rgba(0,255,255,0.2)] flex items-center justify-center gap-2"
            >
              <Zap size={16} /> Finish Assignment (+250 XP)
            </button>
            <button 
              onClick={() => addXP(500)}
              className="px-6 border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/10 rounded-xl font-orbitron uppercase tracking-widest text-[10px] transition-all"
            >
              Epic Task (+500)
            </button>
          </div>
        </GameCard>

      </div>

      {/* ── Attributes Grid ── */}
      <section className="space-y-4">
        <h3 className="font-orbitron font-bold text-sm text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Target size={16} /> Attribute Matrix
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statList.map((stat) => (
            <GameCard key={stat.label} variant={stat.label === 'Academic' ? 'cyan' : stat.label === 'Fitness' ? 'green' : stat.label === 'Social' ? 'gold' : 'purple'} className="p-4">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
              <div className={cn("text-2xl font-black font-orbitron", stat.color)}>{stat.value}</div>
            </GameCard>
          ))}
        </div>
      </section>

      {/* ── Recent Achievements Concept ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GameCard variant="gold" className="flex items-center gap-4 p-6">
           <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
              <Award className="text-yellow-400" size={24} />
           </div>
           <div>
             <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Master Architect</div>
             <div className="text-[10px] text-slate-500 italic mt-0.5">Unlocked at Level 10</div>
           </div>
        </GameCard>
      </section>

    </div>
  );
}
