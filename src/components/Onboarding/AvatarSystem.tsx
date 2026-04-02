"use client";

import { useMemo } from "react";

export type AvatarStyles = {
  skin: string;
  eyes: string;
  outfit: string;
};

interface AvatarSystemProps {
  styles: AvatarStyles;
  size?: number;
  className?: string;
}

const SKIN_COLORS: Record<string, string> = {
  pale: "#ffdbac",
  tan: "#d1a3a4",
  dark: "#8d5524",
  alien: "#8b5cf6", // RPG flair
};

export default function AvatarSystem({ styles, size = 100, className = "" }: AvatarSystemProps) {
  const skinColor = SKIN_COLORS[styles.skin] || SKIN_COLORS.pale;

  const renderOutfit = useMemo(() => {
    switch (styles.outfit) {
      case "level0_vest": // Engineer / Mechatronics
        return (
          <>
            <path d="M 20 80 L 80 80 L 75 100 L 25 100 Z" fill="#475569" />
            <path d="M 35 80 L 65 80 L 60 100 L 40 100 Z" fill="#fbbf24" /> {/* Yellow vest accent */}
            <path d="M 30 85 L 45 85" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case "lab_coat": // Medical
        return (
          <>
            <path d="M 20 80 L 80 80 L 75 100 L 25 100 Z" fill="#f8fafc" />
            <path d="M 50 80 L 50 100" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 30 85 L 35 85 L 35 90 L 30 90 Z" fill="#cbd5e1" /> {/* Pocket */}
          </>
        );
      case "tracksuit": // Athletic
        return (
          <>
            <path d="M 20 80 L 80 80 L 75 100 L 25 100 Z" fill="#ef4444" />
            <path d="M 25 80 L 25 100" stroke="#ffffff" strokeWidth="3" />
            <path d="M 75 80 L 75 100" stroke="#ffffff" strokeWidth="3" />
          </>
        );
      default: // Starter Neutral
        return <path d="M 20 80 L 80 80 L 75 100 L 25 100 Z" fill="#334155" />;
    }
  }, [styles.outfit]);

  const renderEyes = useMemo(() => {
    switch (styles.eyes) {
      case "cyber":
        return (
          <>
            <rect x="35" y="45" width="30" height="8" rx="2" fill="#06b6d4" />
            <circle cx="42" cy="49" r="2" fill="#ffffff" />
            <circle cx="58" cy="49" r="2" fill="#ffffff" />
          </>
        );
      case "tired":
        return (
          <>
            <path d="M 35 48 C 38 45 42 45 45 48" stroke="#1e293b" strokeWidth="2" fill="transparent" />
            <path d="M 55 48 C 58 45 62 45 65 48" stroke="#1e293b" strokeWidth="2" fill="transparent" />
            <path d="M 35 52 C 38 54 42 54 45 52" stroke="#64748b" strokeWidth="2" fill="transparent" /> /* Bags */
            <path d="M 55 52 C 58 54 62 54 65 52" stroke="#64748b" strokeWidth="2" fill="transparent" />
          </>
        );
      default:
        return (
          <>
            <circle cx="40" cy="48" r="4" fill="#1e293b" />
            <circle cx="60" cy="48" r="4" fill="#1e293b" />
            <circle cx="42" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="46" r="1.5" fill="#ffffff" />
          </>
        );
    }
  }, [styles.eyes]);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura/Background glow */}
      <circle cx="50" cy="50" r="45" fill="url(#glow)" />
      
      {/* Body / Shoulders */}
      <path 
        d="M 20 100 C 20 80 30 70 50 70 C 70 70 80 80 80 100" 
        fill={skinColor} 
      />
      
      {/* Outfit logic */}
      {renderOutfit}

      {/* Head */}
      <circle cx="50" cy="45" r="22" fill={skinColor} />
      
      {/* Eyes logic */}
      {renderEyes}

      {/* Mouth */}
      <path d="M 45 58 Q 50 62 55 58" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
