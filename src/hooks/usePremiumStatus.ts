"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/core/supabase/client";

export function usePremiumStatus() {
  const [hasPremium, setHasPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    const fetchStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Initial Fetch
        const { data } = await supabase
          .from("users")
          .select("subscription_status")
          .eq("id", session.user.id)
          .single();

        setHasPremium(data?.subscription_status || false);

        // Real-time listener
        channel = supabase.channel(`public:users:id=eq.${session.user.id}`)
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "users", filter: `id=eq.${session.user.id}` },
            (payload) => {
              if (payload.new.subscription_status !== undefined) {
                setHasPremium(payload.new.subscription_status);
              }
            }
          )
          .subscribe();
      }
      setLoading(false);
    };

    fetchStatus();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { hasPremium, loading };
}
