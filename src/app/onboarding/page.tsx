"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

const ROLES = [
  { label: "Student",  emoji: "📚" },
  { label: "Athlete",  emoji: "⚡" },
  { label: "Developer",emoji: "💻" },
];

const INTERESTS = [
  { label: "Study",           emoji: "📖" },
  { label: "Gym",             emoji: "🏋️" },
  { label: "Self-improvement",emoji: "🧠" },
  { label: "Religion",        emoji: "🌙" },
];

export default function OnboardingPage() {
  const [role, setRole]                         = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading]                   = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  const toggleInterest = (i: string) =>
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const handleComplete = async () => {
    if (!role) return alert("Pick your class first, warrior!");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");
      const userId = session.user.id;

      await supabase.from("users").upsert({
        id: userId, email: session.user.email,
        role, interests: selectedInterests, level: 1, xp: 0, streak: 0,
      });
      await supabase.from("theme").upsert({
        user_id: userId,
        primary_color: "#8b5cf6", accent_color: "#6d28d9",
        background: "#060b16", font_size: "16px",
      });
      router.push("/dashboard");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="rpg-bg" />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-violet-900/20 blur-[100px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-2xl font-black text-white uppercase tracking-widest mb-1">
            Create Character
          </h1>
          <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Choose your class and skills</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold mb-3 text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="h-px flex-1 bg-violet-900/50" />
            Class
            <span className="h-px flex-1 bg-violet-900/50" />
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => setRole(label)}
                className={`py-3 px-2 rounded-lg text-center border transition-all flex flex-col items-center gap-1 ${
                  role === label
                    ? "border-violet-500 bg-violet-500/15 text-white"
                    : "border-violet-900/30 bg-white/3 text-slate-400 hover:border-violet-700/50 hover:text-slate-200"
                }`}
                style={role === label ? { boxShadow: "0 0 14px rgba(139,92,246,0.25)" } : {}}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-xs font-bold font-orbitron">{label.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <label className="block text-xs font-bold mb-3 text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="h-px flex-1 bg-violet-900/50" />
            Skills
            <span className="h-px flex-1 bg-violet-900/50" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => toggleInterest(label)}
                className={`py-2.5 px-3 rounded-lg border transition-all flex items-center gap-2 ${
                  selectedInterests.includes(label)
                    ? "border-violet-500 bg-violet-500/15 text-white"
                    : "border-violet-900/30 bg-white/3 text-slate-400 hover:border-violet-700/50 hover:text-slate-200"
                }`}
                style={selectedInterests.includes(label) ? { boxShadow: "0 0 10px rgba(139,92,246,0.2)" } : {}}
              >
                <span>{emoji}</span>
                <span className="text-xs font-bold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={loading || !role}
          className="btn-ripple w-full bg-gradient-to-r from-violet-700 to-violet-500 hover:brightness-110 disabled:opacity-40 text-white font-black py-3 rounded-lg transition-all uppercase tracking-wider font-orbitron text-sm"
          style={{ boxShadow: "0 0 24px rgba(139,92,246,0.45)" }}
        >
          {loading ? "Entering world..." : "⚔️ Enter the World"}
        </button>
      </div>
    </div>
  );
}
