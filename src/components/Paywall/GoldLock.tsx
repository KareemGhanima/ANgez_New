"use client";

import { useState } from "react";
import UpgradeModal from "./UpgradeModal";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Lock } from "lucide-react";

export default function GoldLock({ children }: { children: React.ReactNode }) {
  const { hasPremium, loading } = usePremiumStatus();
  const [showModal, setShowModal] = useState(false);

  // Still checking auth status
  if (loading) return <div className="animate-pulse bg-slate-800/50 rounded-xl h-full w-full min-h-[100px]"></div>;

  // Render content normally if they have premium
  if (hasPremium) return <>{children}</>;

  // Locked State
  return (
    <div className="relative group overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-slate-900/30 flex flex-col items-center justify-center transition-all duration-300">
        <div className="bg-slate-900/80 border border-yellow-500/30 p-5 rounded-2xl flex flex-col items-center transform scale-95 group-hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3">
             <Lock size={24} className="text-yellow-400" />
          </div>
          <h3 className="font-orbitron font-bold text-white mb-1 text-center">Premium Locked</h3>
          <p className="text-xs text-slate-400 text-center mb-4 px-4">Upgrade to unlock this feature.</p>
          <button 
             onClick={() => setShowModal(true)}
             className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold uppercase tracking-wider text-xs rounded-lg hover:from-yellow-400 hover:to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all"
          >
            Unlock Now
          </button>
        </div>
      </div>
      
      {/* The visually blurred content below */}
      <div className="opacity-30 pointer-events-none select-none filter blur-sm grayscale-[50%]">
        {children}
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
