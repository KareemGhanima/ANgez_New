/**
 * Mock database layer simulating Supabase API calls with delays.
 */

export interface Mission {
  id: string;
  title: string;
  xp_reward: number;
  type: "Academic" | "Fitness" | "Social" | "Other";
}

const MOCK_MISSIONS: Mission[] = [
  { id: "m1", title: "Deep Work Session", xp_reward: 300, type: "Academic" },
  { id: "m2", title: "Iron Core Protocol", xp_reward: 250, type: "Fitness" },
  { id: "m3", title: "Guild Networking", xp_reward: 150, type: "Social" },
  { id: "m4", title: "Base Maintenance", xp_reward: 100, type: "Other" },
];

export async function fetchUserMissions(): Promise<Mission[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_MISSIONS;
}

export async function completeMission(missionId: string): Promise<number> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  const mission = MOCK_MISSIONS.find((m) => m.id === missionId);
  return mission ? mission.xp_reward : 0;
}
