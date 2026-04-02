"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/supabase/client";
import { Users } from "lucide-react";

export default function RevenueOverview() {
  const [totalPremium, setTotalPremium] = useState(0);
  const [breakdown, setBreakdown] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("path")
        .eq("subscription_status", true);

      if (!error && data) {
        setTotalPremium(data.length);
        
        const counts: Record<string, number> = {};
        data.forEach(user => {
           // path is stored "Category:Specialization"
           const cat = user.path ? user.path.split(":")[0] : "Unknown";
           counts[cat] = (counts[cat] || 0) + 1;
        });
        setBreakdown(counts);
      }
      setLoading(false);
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="glass-panel p-6">
      <h2 className="font-orbitron text-xl font-bold text-violet-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
        <Users /> Economy Overview
      </h2>

      {loading ? (
        <div className="animate-pulse bg-slate-800/50 h-24 rounded-lg"></div>
      ) : (
        <div>
           <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center mb-4">
              <div className="text-3xl font-black text-white font-orbitron">{totalPremium}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Active Premium Users</div>
           </div>

           <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Class Breakdown</h3>
              <div className="space-y-2">
                 {Object.keys(breakdown).length === 0 ? (
                    <div className="text-xs text-slate-600">No premium classes initialized.</div>
                 ) : (
                    Object.entries(breakdown).map(([cat, count]) => (
                       <div key={cat} className="flex justify-between text-sm py-1 border-b border-slate-800 last:border-0">
                          <span className="capitalize text-slate-300">{cat}</span>
                          <span className="text-violet-400 font-bold font-orbitron">{count}</span>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
