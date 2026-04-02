"use client";

import { useState } from "react";
import UpgradeModal from "./UpgradeModal";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Lock, ShieldAlert } from "lucide-react";

export default function GoldLock({ children }: { children: React.ReactNode }) {
  const { hasPremium, loading } = usePremiumStatus();
  const [showModal, setShowModal] = useState(false);

  // Still checking auth status
  if (loading) return <div className="animate-pulse bg-brand-dark rounded-xl h-full w-full min-h-[100px] shadow-holo filter blur-sm"></div>;

  // Render content normally if they have premium
  if (hasPremium) return <>{children}</>;

  // Locked State (Digital Shield)
  return (
    <div className="relative group overflow-hidden rounded-xl border border-cardBorder">
      <div className="absolute inset-0 z-10 backdrop-blur-md bg-brand-black/50 flex flex-col items-center justify-center transition-all duration-300">
        
        {/* Holographic Lock Box */}
        <div className="bg-brand-dark/90 border border-neon-gold/50 p-6 rounded-lg flex flex-col items-center transform scale-95 group-hover:scale-100 transition-all duration-300 shadow-shield">
          
          {/* Metallic Gold Lock Graphic */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#9f7928] rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,215,0,0.6)] before:absolute before:inset-1 before:border before:border-yellow-200/50 before:rounded-lg">
             <Lock size={32} className="text-black drop-shadow-md" />
             <div className="absolute -top-2 -right-2 bg-brand-black border border-neon-cyan text-neon-cyan p-1 rounded-full shadow-holo">
               <ShieldAlert size={14} />
             </div>
          </div>
          
          <h3 className="font-orbitron font-black tracking-widest text-[#FFD700] mb-2 text-center uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
            Level Restricted
          </h3>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center mb-5 px-4">
            Security Clearance required<br/>for advanced telemetry.
          </p>
          
          <button 
             onClick={() => setShowModal(true)}
             className="w-full relative px-6 py-2 bg-transparent text-[#FFD700] border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-black font-black uppercase tracking-widest text-xs rounded transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]"
          >
            Lift Override
          </button>
        </div>
      </div>
      
      {/* The visually blurred content below */}
      <div className="opacity-20 pointer-events-none select-none filter blur-[6px] sepia-[50%] hue-rotate-180">
        {children}
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
