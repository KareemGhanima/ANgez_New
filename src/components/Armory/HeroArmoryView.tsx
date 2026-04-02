"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useTranslation } from "react-i18next";
import { useRealtimeProfile } from "@/hooks/useRealtimeProfile";
import AvatarSystem from "../Onboarding/AvatarSystem";
import RechartsRadarChart from "../Stats/RadarChart";
import { Lock, CheckCircle, Save } from "lucide-react";

export default function HeroArmoryView({ initialProfile, userId }: any) {
  const { t } = useTranslation();
  const { stats, xp } = useRealtimeProfile(userId);
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState<"outfits" | "items" | "base">("outfits");
  
  // Local state for live preview edits
  const [avatarStyles, setAvatarStyles] = useState(profile.avatar_styles || { skin: "pale", eyes: "cyber", outfit: "default" });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const currentLevel = Math.floor(xp / 1000) + 1;

  // Mocking items dictionary based on the screenshot
  const outfits = [
    { id: "med_student", name: "Med Student", icon: "👨‍⚕️", minLevel: 1, type: "outfit", internal: "medical" },
    { id: "engineer_vest", name: "Engineering Vest", icon: "🦺", minLevel: 10, type: "outfit", internal: "engineer" },
    { id: "athletic_gear", name: "Athletic Gear", icon: "👕", minLevel: 15, type: "outfit", internal: "athletic" },
    { id: "business_suit", name: "Business Suit", icon: "👔", minLevel: 25, type: "outfit", internal: "suit" },
  ];

  const items = [
    { id: "stethoscope", name: "Stethoscope", icon: "🩺", minLevel: 1, type: "accessory", internal: "steth" },
    { id: "drafting_pencil", name: "Drafting Pencil", icon: "✏️", minLevel: 5, type: "accessory", internal: "pencil" },
    { id: "yoga_mat", name: "Yoga Mat", icon: "🧘‍♀️", minLevel: 8, type: "accessory", internal: "mat" },
    { id: "premium_headset", name: "Premium Headset", icon: "🎧", minLevel: 20, type: "accessory", internal: "headset" },
  ];

  const handleEquip = (item: any) => {
    if (currentLevel < item.minLevel) return;
    setAvatarStyles((prev: any) => ({ ...prev, [item.type]: item.internal }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("users").update({ avatar_styles: avatarStyles }).eq("id", userId);
    setProfile({ ...profile, avatar_styles: avatarStyles });
    setSaving(false);
  };

  const renderGrid = (list: any[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
       {list.map((item) => {
          const isLocked = currentLevel < item.minLevel;
          const isEquipped = avatarStyles[item.type] === item.internal;
          
          return (
             <div 
                key={item.id} 
                onClick={() => handleEquip(item)}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center
                   ${isLocked ? "bg-slate-900/50 border-slate-800 opacity-60" : 
                   isEquipped ? "bg-neon-cyan/10 border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]" : 
                   "bg-brand-dark border-cardBorder hover:border-cyan-500/50"}
                `}
             >
                {/* Lock or Check icon */}
                <div className="absolute top-2 right-2">
                   {isLocked ? <Lock size={14} className="text-red-400" /> : 
                    isEquipped ? <CheckCircle size={14} className="text-neon-cyan" /> : null}
                </div>

                <div className="text-4xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-xs uppercase tracking-widest text-white leading-tight">{item.name}</h4>
                
                <div className="mt-2 text-[10px] font-bold tracking-widest uppercase">
                   {isLocked ? (
                      <span className="text-red-400">{t("armory.locked", "LOCKED")} <br/><span className="text-slate-500">LVL {item.minLevel}</span></span>
                   ) : isEquipped ? (
                      <span className="text-neon-cyan">{t("armory.equipped", "EQUIPPED")}</span>
                   ) : (
                      <span className="text-neon-green">{t("armory.unlocked", "UNLOCKED")}</span>
                   )}
                </div>
             </div>
          );
       })}
    </div>
  );

  return (
    <div className="min-h-screen pb-16 font-orbitron text-white">
      <div className="rpg-bg" />
      
      <header className="glass-panel-header sticky top-0 z-20 px-6 py-4 flex justify-center items-center shadow-holo">
         <h1 className="text-xl font-black tracking-widest text-neon-cyan uppercase">
            {t("armory.title", "HERO'S ARMORY")}
         </h1>
      </header>

      <main className="p-4 md:p-6 max-w-6xl mx-auto mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPASS: PREVIEW */}
        <div className="lg:col-span-5 glass-panel p-5 relative overflow-hidden flex flex-col h-full border-t-2 border-t-neon-cyan">
           <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-between mb-4 border-b border-cardBorder pb-2">
              <span>{t("armory.avatar_preview", "AVATAR PREVIEW")}</span>
              <span className="text-neon-cyan">{t("armory.equipment_bay", "EQUIPMENT BAY")}</span>
           </h2>

           <div className="flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
              {/* Radar strictly pushing behind Avatar */}
              <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                 <div className="w-full h-64 scale-150">
                    <RechartsRadarChart stats={stats || { academic: 0, fitness: 0, discipline: 0, social: 0 }} />
                 </div>
              </div>

              {/* Character Hologram Render */}
              <div className="relative z-10 w-full h-[350px] flex items-end justify-center mb-6">
                 {/* Pedestal */}
                 <div className="absolute bottom-0 w-64 h-8 border border-neon-cyan/50 rounded-[100%] rounded-b-none shadow-[0_-5px_20px_rgba(0,255,255,0.3)] bg-gradient-to-t from-neon-cyan/20 to-transparent"></div>
                 <div className="absolute bottom-2">
                    <AvatarSystem styles={avatarStyles} size={300} />
                 </div>
              </div>

              <div className="text-center font-black tracking-[0.3em] text-neon-cyan text-sm shadow-neon-cyan drop-shadow-md">
                 {t("dashboard.level", "LEVEL")} {currentLevel}
              </div>
           </div>
        </div>

        {/* RIGHT COMPASS: INVENTORY */}
        <div className="lg:col-span-7 flex flex-col h-full">
           <div className="glass-panel p-5 flex-1 flex flex-col border-t-2 border-t-neon-gold">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-between mb-4 border-b border-cardBorder pb-2">
                 <span>{t("armory.inventory_store", "INVENTORY & STORE")}</span>
              </h2>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                 {["outfits", "items", "base"].map(tab => (
                    <button 
                       key={tab} 
                       onClick={() => setActiveTab(tab as any)}
                       className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all
                          ${activeTab === tab ? "bg-neon-cyan text-black" : "bg-brand-dark text-slate-400 hover:text-neon-cyan border border-cardBorder"}`
                       }
                    >
                       {t(`armory.${tab}`, tab)}
                    </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {activeTab === "outfits" && renderGrid(outfits)}
                 {activeTab === "items" && renderGrid(items)}
                 {activeTab === "base" && (
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setAvatarStyles({ ...avatarStyles, skin: "pale" })} className="p-6 border border-cardBorder rounded-xl hover:border-neon-cyan text-center bg-brand-dark">
                          <span className="text-4xl block mb-2">🧑</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{t("armory.male", "MALE AVATAR")}</span>
                       </button>
                       <button onClick={() => setAvatarStyles({ ...avatarStyles, skin: "dark" })} className="p-6 border border-cardBorder rounded-xl hover:border-neon-cyan text-center bg-brand-dark">
                          <span className="text-4xl block mb-2">👩</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{t("armory.female", "FEMALE AVATAR")}</span>
                       </button>
                    </div>
                 )}
              </div>

              <button 
                 onClick={handleSave} disabled={saving}
                 className="mt-6 w-full py-4 text-xs font-black uppercase tracking-[0.2em] rounded-lg bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                 <Save size={16} /> {saving ? "..." : t("armory.save_changes", "SAVE CHANGES")}
              </button>
           </div>
        </div>

      </main>
    </div>
  );
}
