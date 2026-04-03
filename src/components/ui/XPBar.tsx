"use client";

import { motion, AnimatePresence } from "framer-motion";
import { selectXPPercent, selectLevel, selectXPToNextLevel } from "@/store/gameStore";
import { useTranslation } from "react-i18next";

interface XPBarProps {
  xp: number;
}

export default function XPBar({ xp }: XPBarProps) {
  const { t } = useTranslation();
  const percent    = selectXPPercent(xp);
  const level      = selectLevel(xp);
  const nextLevel  = selectXPToNextLevel(xp);

  return (
    <div className="w-full px-2">
      {/* Track */}
      <div className="mana-bar-track w-full h-3 relative overflow-hidden rounded-full">
        <motion.div
          className="mana-bar-fill h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] font-bold text-neon-cyan tracking-wider">
          {t("dashboard.xp", "XP")}: {xp.toLocaleString()} / {nextLevel.toLocaleString()}
        </span>
        <span className="text-[10px] font-bold text-neon-gold">
          {t("dashboard.level", "LVL")} {level}
        </span>
      </div>
    </div>
  );
}
