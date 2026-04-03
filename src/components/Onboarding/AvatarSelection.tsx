"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

// ─── Avatar definitions ───────────────────────────────────────────────────────

type AvatarClass = "medical" | "engineering" | "business" | "cs";

interface AvatarOption {
  id: AvatarClass;
  name: string;
  badge: string;
  badgeColor: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  particleColor: string;
  image: string;
  avatar_url: string;
  description: string;
  stats: { label: string; value: number; color: string }[];
}

const AVATARS: AvatarOption[] = [
  {
    id: "medical",
    name: "MED-CORP",
    badge: "HEALER",
    badgeColor: "text-cyan-400 bg-cyan-400/10 border-cyan-500/40",
    glowColor: "rgba(0,255,255,0.55)",
    borderColor: "#00FFFF",
    bgGradient: "from-cyan-900/30 to-slate-900/80",
    particleColor: "#00FFFF",
    image: "/avatar_medical.png",
    avatar_url: "/avatar_medical.png",
    description: "Masters of life sciences. High academia & discipline stats.",
    stats: [
      { label: "Academic", value: 85, color: "#00FFFF" },
      { label: "Discipline", value: 70, color: "#a855f7" },
      { label: "Fitness", value: 40, color: "#39FF14" },
    ],
  },
  {
    id: "engineering",
    name: "TECH-FORGE",
    badge: "BUILDER",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-500/40",
    glowColor: "rgba(251,146,60,0.55)",
    borderColor: "#fb923c",
    bgGradient: "from-orange-900/30 to-slate-900/80",
    particleColor: "#fb923c",
    image: "/avatar_engineering.png",
    avatar_url: "/avatar_engineering.png",
    description: "Architects of systems. Massive intelligence & tech mastery.",
    stats: [
      { label: "Academic", value: 90, color: "#00FFFF" },
      { label: "Discipline", value: 65, color: "#a855f7" },
      { label: "Fitness", value: 30, color: "#39FF14" },
    ],
  },
  {
    id: "business",
    name: "CORP-WOLF",
    badge: "STRATEGIST",
    badgeColor: "text-yellow-400 bg-yellow-400/10 border-yellow-500/40",
    glowColor: "rgba(250,204,21,0.55)",
    borderColor: "#facc15",
    bgGradient: "from-yellow-900/30 to-slate-900/80",
    particleColor: "#facc15",
    image: "/avatar_business.png",
    avatar_url: "/avatar_business.png",
    description: "Born to lead markets. High social & financial acumen.",
    stats: [
      { label: "Social", value: 90, color: "#facc15" },
      { label: "Discipline", value: 75, color: "#a855f7" },
      { label: "Academic", value: 55, color: "#00FFFF" },
    ],
  },
  {
    id: "cs",
    name: "CODE-GHOST",
    badge: "HACKER",
    badgeColor: "text-violet-400 bg-violet-400/10 border-violet-500/40",
    glowColor: "rgba(168,85,247,0.55)",
    borderColor: "#a855f7",
    bgGradient: "from-violet-900/30 to-slate-900/80",
    particleColor: "#a855f7",
    image: "/avatar_cs.png",
    avatar_url: "/avatar_cs.png",
    description: "Digital phantoms who bend reality with code. Logic supreme.",
    stats: [
      { label: "Academic", value: 80, color: "#00FFFF" },
      { label: "Discipline", value: 85, color: "#a855f7" },
      { label: "Social", value: 35, color: "#facc15" },
    ],
  },
];

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
        <span style={{ color }} className="font-orbitron font-bold">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Avatar Card ──────────────────────────────────────────────────────────────

function AvatarCard({
  avatar,
  isSelected,
  onClick,
}: {
  avatar: AvatarOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      id={`avatar-card-${avatar.id}`}
      onClick={onClick}
      className={`
        relative group w-full text-left rounded-2xl overflow-hidden
        transition-all duration-400 ease-out cursor-pointer
        bg-gradient-to-b ${avatar.bgGradient}
        border-2 focus:outline-none
        ${isSelected ? "scale-[1.03]" : "hover:scale-[1.02]"}
      `}
      style={{
        borderColor: isSelected ? avatar.borderColor : "rgba(51,65,85,0.6)",
        boxShadow: isSelected
          ? `0 0 0 1px ${avatar.borderColor}40, 0 0 30px ${avatar.glowColor}, 0 0 60px ${avatar.glowColor}55, inset 0 0 30px ${avatar.glowColor}15`
          : "0 4px 24px rgba(0,0,0,0.5)",
        transform: isSelected ? "scale(1.03)" : undefined,
      }}
      aria-pressed={isSelected}
    >
      {/* Selected glow shimmer */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 animate-[shimmer_2.5s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${avatar.glowColor}18 50%, transparent 60%)`,
          }}
        />
      )}

      {/* Top-right selection indicator */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold animate-[bounceIn_0.3s_ease-out]"
          style={{
            background: avatar.borderColor,
            boxShadow: `0 0 12px ${avatar.glowColor}`,
            color: "#010816",
          }}
        >
          ✓
        </div>
      )}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* Avatar image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={avatar.image}
          alt={`${avatar.name} avatar`}
          fill
          className={`
            object-cover transition-all duration-500
            ${isSelected ? "scale-105 brightness-110" : "scale-100 brightness-85 group-hover:brightness-100 group-hover:scale-[1.03]"}
          `}
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
        />
        {/* Image bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3 relative z-10">
        {/* Name + badge row */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-orbitron text-base font-bold text-white tracking-wide truncate"
            style={{ textShadow: isSelected ? `0 0 10px ${avatar.glowColor}` : "none" }}
          >
            {avatar.name}
          </h3>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${avatar.badgeColor} whitespace-nowrap`}
          >
            {avatar.badge}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{avatar.description}</p>

        {/* Stats */}
        <div className="space-y-2 pt-1">
          {avatar.stats.map((s) => (
            <StatBar key={s.label} {...s} />
          ))}
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AvatarSelection() {
  const [selectedId, setSelectedId] = useState<AvatarClass | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const selected = AVATARS.find((a) => a.id === selectedId);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // 1. Initialize/Update user profile
      const { error: userError } = await supabase
        .from("users")
        .upsert({ 
          id: userId,
          avatar_url: selected.avatar_url,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "Recruit",
          level: 1,
          xp: 0
        });

      if (userError) throw userError;

      // 2. Map and initialize starting attributes
      const statsMap = selected.stats.reduce((acc, s) => {
        const key = s.label.toLowerCase() as keyof typeof acc;
        acc[key] = s.value;
        return acc;
      }, { academic: 0, discipline: 0, fitness: 0, social: 0 });

      const { error: attrError } = await supabase
        .from("attributes")
        .upsert({
          user_id: userId,
          ...statsMap
        });

      if (attrError) throw attrError;

      setSuccess(true);
      // Navigate after a brief success flash to dashboard
      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync with neural link.";
      setError(msg);
      console.error("Supabase sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen rpg-bg flex flex-col items-center justify-center p-4 sm:p-8 relative">

      {/* ── Header ── */}
      <div className="text-center mb-8 sm:mb-10 z-10">
        <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          ONBOARDING · STEP 01
        </div>
        <h1 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          CHOOSE YOUR{" "}
          <span
            className="relative inline-block"
            style={{ textShadow: "0 0 30px rgba(0,255,255,0.8)" }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              CLASS
            </span>
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Your class defines your starting stats and unlocks specialized quests. Choose wisely — this shapes your legend.
        </p>
      </div>

      {/* ── Avatar Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl z-10">
        {AVATARS.map((avatar) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedId === avatar.id}
            onClick={() => setSelectedId(avatar.id)}
          />
        ))}
      </div>

      {/* ── Selection status bar ── */}
      <div className="mt-6 z-10 w-full max-w-5xl">
        <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status text */}
          <div className="flex items-center gap-3 text-sm">
            {selected ? (
              <>
                <div
                  className="w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0"
                  style={{ borderColor: selected.borderColor, boxShadow: `0 0 10px ${selected.glowColor}` }}
                >
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-orbitron font-bold text-sm">{selected.name}</p>
                  <p className="text-slate-400 text-xs">{selected.badge} class selected</p>
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">← Select a class to begin your journey</p>
            )}
          </div>

          {/* Error or Confirm button */}
          <div className="flex flex-col items-end gap-2 min-w-[200px]">
            {error && (
              <p className="text-red-400 text-xs text-right">{error}</p>
            )}
            <button
              id="confirm-avatar-btn"
              onClick={handleConfirm}
              disabled={!selectedId || loading || success}
              className={`
                relative w-full sm:w-auto px-8 py-3 rounded-xl font-orbitron font-bold text-sm uppercase tracking-widest
                transition-all duration-300 overflow-hidden
                disabled:opacity-40 disabled:cursor-not-allowed
                ${selectedId && !loading && !success
                  ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-105 active:scale-100"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
                }
              `}
              style={
                selectedId && !loading && !success && selected
                  ? { boxShadow: `0 0 20px ${selected.glowColor}55` }
                  : {}
              }
            >
              {/* Ripple bg */}
              {selectedId && !loading && !success && (
                <span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700"
                  aria-hidden
                />
              )}
              {success ? (
                <span className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> LOCKED IN
                </span>
              ) : loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  SYNCING...
                </span>
              ) : (
                "CONFIRM SELECTION →"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Decorative particles ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-[float_linear_infinite]"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: i % 4 === 0 ? "#00FFFF" : i % 4 === 1 ? "#a855f7" : i % 4 === 2 ? "#facc15" : "#fb923c",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 8 + 6 + "s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
