"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAngez } from "@/context/AngezContext";
import { LayoutDashboard, Swords, Briefcase, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Missions", href: "/missions", icon: Swords },
  { name: "Armory", href: "/armory", icon: Briefcase },
  { name: "Avatar", href: "/avatar-selection", icon: User },
];

// ─── Mini HUD Component ───────────────────────────────────────────────────────

function MiniHUD() {
  const { user } = useAngez();
  const xpPercent = (user.currentXP / 1000) * 100;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-900/60 rounded-xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-3">
        {/* Mini Avatar */}
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/50 p-0.5 overflow-hidden ring-2 ring-cyan-500/10">
          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        </div>
        {/* Level & Name */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-black text-cyan-400 tracking-tighter">LVL {user.level}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-950 rounded-full mt-1.5 overflow-hidden p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,255,255,0.5)] transition-all duration-500"
              style={{ width: `${Math.max(xpPercent, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NavBar Component ─────────────────────────────────────────────────────────

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-950 border-r border-white/5 z-40 p-4">
        <div className="flex items-center gap-2 mb-10 px-2 mt-4">
          <Zap className="text-cyan-400 fill-cyan-400/20" size={24} />
          <span className="font-orbitron font-black text-xl tracking-widest text-white">ANGEZ</span>
        </div>

        <div className="flex-1 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-orbitron text-xs font-bold uppercase tracking-widest transition-all",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.05)]" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto">
          <MiniHUD />
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 z-40 flex justify-between items-center shadow-2xl">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                isActive ? "text-cyan-400" : "text-slate-500"
              )}
            >
              <link.icon size={20} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{link.name}</span>
            </Link>
          );
        })}
        
        {/* Mobile Mini Profile Circle */}
        <div className="p-1 pr-3 border-l border-white/5 ml-2">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 p-0.5">
             <Link href="/settings">
                <img 
                  src={(useAngez()).user.avatar} 
                  alt="U" 
                  className="w-full h-full object-cover rounded-full" 
                />
             </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
