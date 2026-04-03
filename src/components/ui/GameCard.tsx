"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "cyan" | "purple" | "gold" | "green";
  glow?: boolean;
}

const GameCard = ({
  children,
  className,
  variant = "cyan",
  glow = true,
  ...props
}: GameCardProps) => {
  const variantStyles = {
    cyan: "border-neon-cyan/30 hover:border-neon-cyan/60 shadow-neon-cyan/10",
    purple: "border-neon-purple/30 hover:border-neon-purple/60 shadow-neon-purple/10",
    gold: "border-neon-gold/30 hover:border-neon-gold/60 shadow-neon-gold/10",
    green: "border-neon-green/30 hover:border-neon-green/60 shadow-neon-green/10",
  };

  const glowStyles = {
    cyan: "hover:shadow-[0_0_20px_rgba(0,255,255,0.25)]",
    purple: "hover:shadow-[0_0_20px_rgba(188,19,254,0.25)]",
    gold: "hover:shadow-[0_0_20px_rgba(255,215,0,0.25)]",
    green: "hover:shadow-[0_0_20px_rgba(57,255,20,0.25)]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-slate-950/80 p-4 transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100",
        "after:absolute after:inset-0 after:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none",
        variantStyles[variant],
        glow && glowStyles[variant],
        "active:scale-[0.98] cursor-pointer", // Larger touch feel
        "min-h-[100px] flex flex-col justify-center", // Touch target friendly
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      
      {/* Futuristic Corner Decoration */}
      <div className={cn(
        "absolute top-0 left-0 w-2 h-2 border-t border-l",
        variant === 'cyan' ? 'border-neon-cyan' : 
        variant === 'purple' ? 'border-neon-purple' : 
        variant === 'gold' ? 'border-neon-gold' : 'border-neon-green'
      )} />
      <div className={cn(
        "absolute bottom-0 right-0 w-2 h-2 border-b border-r",
        variant === 'cyan' ? 'border-neon-cyan' : 
        variant === 'purple' ? 'border-neon-purple' : 
        variant === 'gold' ? 'border-neon-gold' : 'border-neon-green'
      )} />
    </div>
  );
};

export default GameCard;
