"use client";

import { useState } from "react";
import AvatarSystem from "../Onboarding/AvatarSystem";
import { Book, Dumbbell, Target, Users, Zap, Info, PackageX } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

// ─── Data Types ───────────────────────────────────────────────────────────────

type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

interface ItemStat {
  type: "Academic" | "Discipline" | "Fitness" | "Social";
  value: number;
  icon: any;
  color: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: "Head" | "Accessory" | "Setup" | "Aura";
  rarity: Rarity;
  stats: ItemStat[];
  description: string;
  icon: string;
}

const RARITY_STYLES: Record<Rarity, { border: string; bg: string; text: string; glow: string; shadow: string }> = {
  Common: { border: "border-slate-500", bg: "bg-slate-500/10", text: "text-slate-400", glow: "rgba(100,116,139,0.3)", shadow: "shadow-[0_0_10px_rgba(100,116,139,0.2)]" },
  Rare: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-400", glow: "rgba(59,130,246,0.6)", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]" },
  Epic: { border: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-400", glow: "rgba(168,85,247,0.6)", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  Legendary: { border: "border-yellow-400", bg: "bg-yellow-400/10", text: "text-yellow-400", glow: "rgba(250,204,21,0.6)", shadow: "shadow-[0_0_25px_rgba(250,204,21,0.5)]" },
};

const INVENTORY: InventoryItem[] = [
  {
    id: "itm_01",
    name: "Focus Glasses",
    category: "Head",
    rarity: "Rare",
    description: "Filters out blue light and distractions. Increases reading endurance.",
    icon: "👓",
    stats: [{ type: "Academic", value: 5, icon: Book, color: "text-cyan-400" }, { type: "Discipline", value: 2, icon: Target, color: "text-purple-400" }]
  },
  {
    id: "itm_02",
    name: "Mechanical Keyboard",
    category: "Setup",
    rarity: "Epic",
    description: "Loud, responsive, and incredibly satisfying. Boosts coding speed.",
    icon: "⌨️",
    stats: [{ type: "Academic", value: 10, icon: Book, color: "text-cyan-400" }, { type: "Social", value: -2, icon: Users, color: "text-yellow-400" }]
  },
  {
    id: "itm_03",
    name: "Smart Watch",
    category: "Accessory",
    rarity: "Epic",
    description: "Tracks heart rate and steps. A must-have for the modern athlete.",
    icon: "⌚",
    stats: [{ type: "Fitness", value: 12, icon: Dumbbell, color: "text-green-400" }, { type: "Discipline", value: 5, icon: Target, color: "text-purple-400" }]
  },
  {
    id: "itm_04",
    name: "Founder's Aura",
    category: "Aura",
    rarity: "Legendary",
    description: "A charismatic glow that makes networking effortless.",
    icon: "✨",
    stats: [{ type: "Social", value: 20, icon: Users, color: "text-yellow-400" }, { type: "Discipline", value: 10, icon: Target, color: "text-purple-400" }]
  },
  {
    id: "itm_05",
    name: "Energy Drink Stack",
    category: "Accessory",
    rarity: "Common",
    description: "Temporary boost, terrible crash.",
    icon: "🥤",
    stats: [{ type: "Academic", value: 3, icon: Book, color: "text-cyan-400" }, { type: "Fitness", value: -1, icon: Dumbbell, color: "text-green-400" }]
  },
  {
    id: "itm_06",
    name: "Noise-Cancelling Pods",
    category: "Head",
    rarity: "Rare",
    description: "Blocks out the entire world.",
    icon: "🎧",
    stats: [{ type: "Discipline", value: 8, icon: Target, color: "text-purple-400" }]
  }
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArmorySystem() {
  const profile = useGameStore(s => s.profile);
  
  // Track equipped items by category (one per category allowed)
  const [equipped, setEquipped] = useState<Record<string, InventoryItem>>({});

  const handleToggleEquip = (item: InventoryItem) => {
    setEquipped(prev => {
      const next = { ...prev };
      // If same item is equipped, unequip it
      if (next[item.category]?.id === item.id) {
        delete next[item.category];
      } else {
        // Equip item (overwrites existing category slot)
        next[item.category] = item;
      }
      return next;
    });
  };

  const equippedItemsList = Object.values(equipped);

  return (
    <div className="min-h-screen rpg-bg pb-12 p-4 md:p-8 flex flex-col items-center">
      
      {/* ── Header ── */}
      <div className="w-full max-w-7xl glass-panel-header p-6 rounded-2xl mb-8 flex justify-between items-center text-white border border-slate-700 shadow-holo">
        <div>
          <h1 className="font-orbitron font-black text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan drop-shadow-[0_0_10px_purple]">
            HERO ARMORY
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider font-bold">Manage your inventory and equip gear</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase font-bold">Storage Caps</span>
          <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg font-orbitron font-bold text-cyan-400">
            {INVENTORY.length} / 50 <span className="text-slate-500 text-xs ml-1">SLOTS</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ════ LEFT COL: AVATAR & EQUIPPED GEAR (col-span-4) ════ */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col items-center border border-slate-700/50 shadow-2xl">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

            <h2 className="w-full text-left font-orbitron font-bold text-sm text-slate-400 uppercase tracking-widest border-b border-white/10 pb-3 mb-6">
              Live Preview
            </h2>

            {/* Avatar Render */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-slate-700 flex justify-center items-end bg-slate-900/50 mb-8 overflow-hidden">
               {/* Ground plate */}
               <div className="absolute bottom-0 w-3/4 h-8 bg-cyan-500/20 blur-md rounded-[100%]" />
               
               {/* Using fallback or actual url if present */}
               {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
               ) : (
                  <AvatarSystem styles={profile?.avatar_styles ?? { skin: "pale", eyes: "cyber", outfit: "default" }} size={240} className="mb-2" />
               )}
            </div>

            {/* Equipped Loadout Slots */}
            <div className="w-full">
              <h3 className="font-orbitron text-xs text-cyan-400 uppercase tracking-widest mb-3 font-bold">Current Loadout</h3>
              <div className="space-y-3">
                {["Head", "Accessory", "Setup", "Aura"].map((slot) => {
                  const item = equipped[slot];
                  return (
                    <div key={slot} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-xl bg-slate-950 border ${item ? RARITY_STYLES[item.rarity].border : "border-slate-800 border-dashed"}`}
                           style={{ boxShadow: item ? RARITY_STYLES[item.rarity].shadow : "none" }}>
                        {item ? item.icon : <PackageX className="text-slate-700" size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{slot} Slot</div>
                        <div className={`text-sm font-bold truncate ${item ? item.rarity === 'Common' ? 'text-slate-300' : RARITY_STYLES[item.rarity].text : 'text-slate-600'}`}>
                          {item ? item.name : "Empty"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ════ RIGHT COL: INVENTORY GRID (col-span-8) ════ */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl border border-slate-700/50 flex flex-col max-h-[85vh]">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase tracking-widest flex items-center gap-3">
              <Zap className="text-yellow-400" /> Equipment Stash
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-auto pr-2 custom-scrollbar pb-6">
            {INVENTORY.map((item) => {
              const isEquipped = equipped[item.category]?.id === item.id;
              const rStyle = RARITY_STYLES[item.rarity];

              return (
                <div 
                  key={item.id}
                  className={`
                    group relative flex flex-col bg-slate-900/80 rounded-2xl border transition-all duration-300 cursor-pointer overflow-visible
                    ${isEquipped ? 'scale-[1.02] bg-slate-800 z-10' : 'hover:scale-[1.02] hover:bg-slate-800/90 z-0 hover:z-20'}
                  `}
                  style={{
                    borderColor: isEquipped ? rStyle.glow : 'rgba(51,65,85,0.8)',
                    boxShadow: isEquipped ? rStyle.shadow : '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                  onClick={() => handleToggleEquip(item)}
                >
                  {/* Equipped Status Badge */}
                  {isEquipped && (
                    <div className="absolute -top-3 -right-3 bg-neon-cyan text-slate-950 font-black text-[10px] px-3 py-1 rounded-full border-2 border-slate-900 tracking-widest uppercase shadow-[0_0_10px_rgba(0,255,255,0.5)] z-10">
                      Equipped
                    </div>
                  )}

                  {/* Icon & Rarity Area */}
                  <div className={`h-24 w-full flex flex-col items-center justify-center rounded-t-2xl relative overflow-hidden ${rStyle.bg}`}>
                    {/* Inner glow */}
                    <div className="absolute inset-0 opacity-40 z-0" style={{ background: `radial-gradient(circle at center, ${rStyle.glow} 0%, transparent 70%)` }} />
                    <span className="text-4xl drop-shadow-lg relative z-10">{item.icon}</span>
                  </div>

                  {/* Info Area */}
                  <div className="p-4 flex flex-col flex-1 relative">
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${rStyle.text}`}>
                      {item.rarity} · {item.category}
                    </span>
                    <h3 className="font-orbitron font-bold text-slate-200 text-base leading-tight mb-3">
                      {item.name}
                    </h3>

                    {/* Stat Badges */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {item.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded text-xs border border-slate-800 shadow-inner">
                          <stat.icon size={12} className={stat.color} />
                          <span className={`font-bold ${stat.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stat.value > 0 ? '+' : ''}{stat.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Hover Tooltip (appears on hover) */}
                    <div className="absolute bottom-full left-0 w-[110%] -translate-x-[5%] mb-4 bg-slate-950 border border-slate-700 shadow-2xl rounded-xl p-4 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50">
                       <p className="text-slate-300 text-xs leading-relaxed italic mb-3">"{item.description}"</p>
                       <div className="flex flex-col gap-1 border-t border-slate-800 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stat Bonuses</span>
                          {item.stats.map((stat, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 flex items-center gap-1"><stat.icon size={10}/> {stat.type}</span>
                              <span className={`font-bold ${stat.value > 0 ? 'text-green-400' : 'text-red-400'}`}>{stat.value > 0 ? '+' : ''}{stat.value}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
