"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";
import PaymentManager from "@/components/Admin/PaymentManager";
import RevenueOverview from "@/components/Admin/RevenueOverview";
import QRManager from "@/components/Admin/QRManager";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (user?.role === "admin") {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    verifyAdmin();
  }, [supabase, router]);

  if (loading) return <div className="min-h-screen bg-[#060b16] text-white flex items-center justify-center font-orbitron">Loading Command Center...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#060b16] text-white flex flex-col items-center justify-center font-orbitron p-8 text-center">
        <h1 className="text-4xl text-red-500 font-bold mb-4">ACCESS DENIED</h1>
        <p className="text-slate-400">You do not have sufficient clearance to enter the Command Center.</p>
        <button onClick={() => router.push("/")} className="mt-8 text-violet-400 hover:text-violet-300">Return to base</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen rpg-bg p-4 md:p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-8 border-b border-violet-900/50 pb-4">
          <h1 className="font-orbitron font-black text-3xl neon-text-purple uppercase tracking-widest">Command Center</h1>
          <p className="text-violet-400/80 text-sm mt-1 uppercase tracking-wider">Owner Dashboard & Economy Watch</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <PaymentManager />
           </div>
           <div className="space-y-6">
              <RevenueOverview />
              <QRManager />
           </div>
        </div>
      </div>
    </div>
  );
}
