"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";
import AvatarSystem from "./AvatarSystem";

type PathType = "engineering" | "medical" | "athletic";

const PATH_SPECIALIZATIONS: Record<PathType, string[]> = {
  engineering: ["Mechatronics", "Computer", "Mechanical", "Electrical"],
  medical: ["Medicine", "Pharmacy", "Dentistry", "Nursing"],
  athletic: ["Track and Field", "Weightlifting", "Football", "Martial Arts"],
};

export default function HeroJourney() {
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);
  const [specialization, setSpecialization] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Avatar derives from state
  const currentAvatarStyles = {
    skin: "pale",
    eyes: "cyber",
    outfit: selectedPath === "engineering" ? "level0_vest" : 
             selectedPath === "medical" ? "lab_coat" : 
             selectedPath === "athletic" ? "tracksuit" : "default"
  };

  const currentStats = {
    academic: selectedPath === "engineering" ? 300 : selectedPath === "medical" ? 400 : 50,
    fitness: selectedPath === "athletic" ? 400 : 50,
    discipline: selectedPath === "engineering" ? 200 : selectedPath === "medical" ? 200 : 300,
    social: 100,
  };

  const handleBeginJourney = async () => {
    if (!selectedPath || !specialization) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        path: `${selectedPath}:${specialization}`,
        avatar_styles: currentAvatarStyles,
        stats: currentStats
      })
      .eq("id", session.user.id);

    setLoading(false);
    if (!error) {
      router.push("/dashboard");
    } else {
      alert("Failed to save journey: " + error.message);
    }
  };

  return (
    <div className="min-h-screen rpg-bg flex flex-col items-center justify-center p-6 text-white">
      <div className="glass-panel p-8 max-w-2xl w-full">
        <h1 className="font-orbitron text-3xl font-bold text-center mb-2 neon-text-purple">Choose Your Path</h1>
        <p className="text-slate-400 text-center mb-8">Every hero needs an origin. What's yours?</p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center flex-1 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <AvatarSystem styles={currentAvatarStyles} size={150} className="drop-shadow-2xl" />
            <h3 className="font-orbitron mt-4 text-violet-400 capitalize">{selectedPath || "Unknown Path"}</h3>
            <span className="text-xs text-slate-500 uppercase tracking-widest">{specialization || "Awaiting Spec"}</span>
          </div>

          {/* Form */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Main Path</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PATH_SPECIALIZATIONS) as PathType[]).map((path) => (
                  <button
                    key={path}
                    onClick={() => {
                      setSelectedPath(path);
                      setSpecialization(PATH_SPECIALIZATIONS[path][0]); // Auto-select first spec
                    }}
                    className={`py-2 px-1 text-xs rounded border transition-all uppercase tracking-wider font-orbitron ${selectedPath === path ? "bg-violet-900/50 border-violet-500 text-violet-200 neon-purple" : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"}`}
                  >
                    {path}
                  </button>
                ))}
              </div>
            </div>

            {selectedPath && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-bold text-slate-300 mb-2">Sub-Specialization</label>
                <select 
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
                >
                  {PATH_SPECIALIZATIONS[selectedPath].map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleBeginJourney}
              disabled={!selectedPath || !specialization || loading}
              className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 font-orbitron font-bold uppercase tracking-widest hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Awakening..." : "Begin Journey"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
