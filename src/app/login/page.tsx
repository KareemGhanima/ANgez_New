"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Guard: check env vars are loaded
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("App configuration error: Supabase environment variables are missing. Contact support.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        router.push("/onboarding");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("users")
          .select("role, path")
          .eq("id", data.user.id)
          .single();

        if (profile?.path) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      // Catch HTML-response errors (misconfigured Supabase) gracefully
      const msg: string = err?.message ?? String(err);
      if (msg.includes("<!DOCTYPE") || msg.includes("Unexpected token")) {
        setError("Network error: unable to reach authentication server. Check your connection.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="rpg-bg" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-900/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-900/20 blur-[60px] pointer-events-none" />

      <div className="glass-panel w-full max-w-sm p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-black text-white mb-1"
            style={{ textShadow: "0 0 30px rgba(168,85,247,0.7)" }}>
            ANGEZ
          </h1>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-violet-500 to-transparent mb-3" />
          <p className="text-slate-400 text-sm uppercase tracking-widest font-orbitron">
            {isSignUp ? "Create Your Character" : "Level Up Your Real Life"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">EMAIL</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-violet-700/30 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
              placeholder="player@angez.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">PASSWORD</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full bg-white/5 border border-violet-700/30 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-ripple w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:brightness-110 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all uppercase tracking-wider font-orbitron text-sm mt-2"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
          >
            {loading ? "Loading..." : isSignUp ? "CREATE CHARACTER" : "ENTER WORLD"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="text-sm text-violet-400/70 hover:text-violet-400 transition-colors"
          >
            {isSignUp ? "← Already have an account? Log In" : "New Player? Create a Character →"}
          </button>
        </div>
      </div>
    </div>
  );
}
