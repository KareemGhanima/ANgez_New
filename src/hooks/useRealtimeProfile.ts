"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/supabase/client";

export function useRealtimeProfile(userId: string) {
  const [stats, setStats] = useState<{ academic: number; fitness: number; discipline: number; social: number }>({
     academic: 0, fitness: 0, discipline: 0, social: 0
  });
  const [xp, setXp] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    let channel: any;

    const fetchInitial = async () => {
       const { data } = await supabase.from("users").select("stats, xp").eq("id", userId).single();
       if (data) {
          if (data.stats) setStats(data.stats);
          setXp(data.xp || 0);
       }

       channel = supabase.channel(`public:users:metrics:${userId}`)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "users", filter: `id=eq.${userId}` },
            (payload: any) => {
              if (payload.new.stats !== undefined) {
                 setStats(payload.new.stats);
              }
              if (payload.new.xp !== undefined) {
                 setXp(payload.new.xp);
              }
            }
          ).subscribe();
    };

    fetchInitial();

    return () => {
       if (channel) supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return { stats, xp };
}
