"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

const ROLES = ["Student", "Athlete", "Developer"];
const INTERESTS = ["Study", "Gym", "Self-improvement", "Religion"];

export default function OnboardingPage() {
  const [role, setRole] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleInterest = (i: string) => {
    if (selectedInterests.includes(i)) {
      setSelectedInterests(selectedInterests.filter(x => x !== i));
    } else {
      setSelectedInterests([...selectedInterests, i]);
    }
  };

  const handleComplete = async () => {
    if (!role) return alert("Select a role first!");
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");
      const userId = session.user.id;

      // Upsert user details
      const { error: userError } = await supabase
        .from("users")
        .upsert({
          id: userId,
          email: session.user.email,
          role,
          interests: selectedInterests,
          level: 1,
          xp: 0,
          streak: 0
        });

      if (userError) throw userError;

      // Upsert default theme
      const { error: themeError } = await supabase
        .from("theme")
        .upsert({
          user_id: userId,
          primary_color: '#8b5cf6',
          accent_color: '#6d28d9',
          background: '#0f172a',
          font_size: '16px'
        });

      if (themeError) throw themeError;

      router.push("/dashboard");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="glass-panel w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Create Character</h1>
        <p className="text-foreground/70 mb-6">Choose your path and configure your starting stats.</p>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Class (Role)</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-2 px-3 rounded text-sm text-center border transition-colors ${
                  role === r 
                    ? "border-primary bg-primary/20 text-primary font-semibold" 
                    : "border-cardBorder bg-background hover:bg-cardBorder/50 text-foreground/80"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2">Interests (Skills)</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={`py-1 px-3 rounded-full text-sm border transition-colors ${
                  selectedInterests.includes(i)
                    ? "border-primary bg-primary text-white"
                    : "border-cardBorder bg-background text-foreground/70 hover:border-foreground/30"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={loading || !role}
          className="w-full bg-primary hover:bg-accent disabled:opacity-50 text-white font-bold py-3 rounded transition-colors shadow-lg"
        >
          {loading ? "Saving..." : "Enter the World"}
        </button>
      </div>
    </div>
  );
}
