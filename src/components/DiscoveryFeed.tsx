"use client";

import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FEED_ITEMS = [
  { id: 1, title: "Read 2 Pages of a Book", xp: 50, emoji: "📖", tag: "Academic" },
  { id: 2, title: "1-Minute Stretch", xp: 30, emoji: "🧘", tag: "Fitness" },
  { id: 3, title: "Read 2 Pages of a Book", xp: 50, emoji: "📖", tag: "Academic" },
  { id: 4, title: "1-Minute Stretch", xp: 30, emoji: "🧘", tag: "Fitness" },
];

export default function DiscoveryFeed() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {FEED_ITEMS.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="flex bg-brand-dark/80 border border-cardBorder rounded-lg overflow-hidden hover:border-neon-pink/50 transition-colors"
        >
          <div className="w-20 bg-slate-800 relative flex items-center justify-center text-3xl flex-shrink-0">
            {item.emoji}
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
              <p className="text-[10px] text-neon-green font-bold mt-1">+{item.xp} {t("dashboard.xp", "XP")}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="self-start mt-2 px-3 py-1 text-[10px] border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/20 transition-colors"
            >
              {t("dashboard.add_to_missions", "Add to Missions")}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
