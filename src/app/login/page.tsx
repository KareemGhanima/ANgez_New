"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Proceed to onboarding
        router.push("/onboarding");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // First check if onboarding is needed
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        if (profile?.role) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Angez</h1>
        <p className="text-center text-foreground/70 mb-8">
          Level up your real life.
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className="text-sm text-danger bg-danger/10 p-3 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm mb-1 text-foreground/80">Email</label>
            <input
              type="email"
              required
              className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-foreground/80">Password</label>
            <input
              type="password"
              required
              className="w-full bg-background border border-cardBorder rounded px-3 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-white font-semibold py-2 rounded transition-colors"
          >
            {loading ? "Loading..." : isSignUp ? "Create Character" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Log In" : "New player? Create Character"}
          </button>
        </div>
      </div>
    </div>
  );
}
