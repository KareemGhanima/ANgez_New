"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Activity } from "lucide-react";

export default function ActivityHeatmap({ streak, xp }: { streak: number, xp: number }) {
  const { t } = useTranslation();
  
  // Generate 90 days of pseudo-data matching current streak for visual rendering
  const days = useMemo(() => {
     const arr = [];
     const today = new Date();
     
     // Base activity off of streak
     for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        
        let level = 0;
        // Logic to simulate recent streak activity
        if (i < streak) {
           level = Math.floor(Math.random() * 3) + 2; // Level 2, 3, or 4
        } else if (Math.random() > 0.8) {
           level = 1; 
        }

        arr.push({ date: d, level });
     }
     return arr;
  }, [streak]);

  const getIntensityClass = (level: number) => {
     switch (level) {
        case 4: return "bg-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]";
        case 3: return "bg-[#00b3b3]";
        case 2: return "bg-[#008080]";
        case 1: return "bg-[#004d4d]";
        case 0: 
        default: return "bg-brand-black border border-cardBorder";
     }
  };

  return (
    <div className="glass-panel p-5 mt-6 border-t-2 border-t-neon-cyan">
       <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
             <Activity size={16} className="text-neon-cyan" /> 
             {t("dashboard.activity_heatmap", "TACTICAL CONTRIBUTIONS")}
          </h2>
          <span className="text-xs font-bold text-slate-400">90 {t("dashboard.days", "DAYS")}</span>
       </div>

       <div className="overflow-x-auto custom-scrollbar pb-2">
          {/* We arrange as columns: 12-13 cols of 7 rows */}
          <div className="flex gap-[3px] min-w-[max-content]">
             {Array.from({ length: Math.ceil(days.length / 7) }).map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-[3px]">
                   {days.slice(colIndex * 7, colIndex * 7 + 7).map((day, rowIndex) => (
                      <div 
                         key={`${colIndex}-${rowIndex}`}
                         title={`${day.date.toDateString()}`}
                         className={`w-3 h-3 rounded-[2px] transition-all hover:scale-125 cursor-crosshair ${getIntensityClass(day.level)}`}
                      ></div>
                   ))}
                </div>
             ))}
          </div>
       </div>

       <div className="mt-4 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-widest">
          <span>{t("dashboard.current_streak", "ACTIVE STREAK")}: <span className="text-neon-cyan">{streak}</span></span>
          <div className="flex items-center gap-1">
             <span>{t("dashboard.less", "LESS")}</span>
             <div className="w-2.5 h-2.5 bg-brand-black border border-cardBorder"></div>
             <div className="w-2.5 h-2.5 bg-[#004d4d]"></div>
             <div className="w-2.5 h-2.5 bg-[#008080]"></div>
             <div className="w-2.5 h-2.5 bg-[#00b3b3]"></div>
             <div className="w-2.5 h-2.5 bg-neon-cyan shadow-[0_0_5px_rgba(0,255,255,0.8)]"></div>
             <span>{t("dashboard.more", "MORE")}</span>
          </div>
       </div>
    </div>
  );
}
