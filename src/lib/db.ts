import { createClient } from "@/core/supabase/client";

/**
 * Real database layer interacting with Supabase.
 */

const supabase = createClient();

export interface Mission {
  id: string;
  title: string;
  xp_reward: number;
  type: string;
}

const MOCK_MISSIONS: Mission[] = [
  { id: "m1", title: "Deep Work Session", xp_reward: 300, type: "Academic" },
  { id: "m2", title: "Iron Core Protocol", xp_reward: 250, type: "Fitness" },
  { id: "m3", title: "Guild Networking", xp_reward: 150, type: "Social" },
  { id: "m4", title: "Base Maintenance", xp_reward: 100, type: "Other" },
];

export async function fetchUserMissions(): Promise<Mission[]> {
  try {
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .limit(10);
    
    if (error || !data || data.length === 0) {
      console.warn("Using mock missions. (Did you run the seed script?)", error);
      return MOCK_MISSIONS;
    }
    
    return data as Mission[];
  } catch (err) {
    console.error("Database fetch failed:", err);
    return MOCK_MISSIONS;
  }
}

/**
 * Records mission completion and awards XP via RPC.
 */
export async function completeMission(missionId: string, userId: string): Promise<number> {
  try {
    // 1. Get mission details
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("xp_reward")
      .eq("id", missionId)
      .single();
    
    if (missionError || !mission) throw new Error("Mission not found");

    // 2. Award XP safely using the RPC we created
    const { error: rpcError } = await supabase.rpc('award_xp', { 
      user_id_param: userId, 
      xp_addition: mission.xp_reward 
    });

    if (rpcError) throw rpcError;

    // 3. Mark mission as completed in junction table
    await supabase
      .from("user_missions")
      .upsert({ 
        user_id: userId, 
        mission_id: missionId, 
        status: 'completed',
        completed_at: new Date().toISOString()
      });

    return mission.xp_reward;
  } catch (err) {
    console.error("Failed to complete mission in Supabase:", err);
    // Fallback for demo/dev purposes
    const mockMission = MOCK_MISSIONS.find(m => m.id === missionId);
    return mockMission ? mockMission.xp_reward : 0;
  }
}
