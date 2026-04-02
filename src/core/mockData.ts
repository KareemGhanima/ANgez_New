export interface UserState {
  level: number;
  xp: number;
  streak: number;
  attributes: {
    mind: number;
    body: number;
    knowledge: number;
    social: number;
  };
  avatarStyle: "student" | "athlete" | "casual";
  avatarState: "high_activity" | "tired" | "normal";
}

export interface Quest {
  id: string;
  title: string;
  category: "mind" | "body" | "knowledge" | "social";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  state: "pending" | "completed" | "skipped" | "later";
  interestedScore?: number;
}

export const initialUserState: UserState = {
  level: 1,
  xp: 0,
  streak: 3,
  attributes: { mind: 10, body: 10, knowledge: 10, social: 10 },
  avatarStyle: "casual",
  avatarState: "normal"
};

export const initialQuests: Quest[] = [
  { id: "1", title: "Read 10 pages of a book", category: "knowledge", difficulty: "easy", xpReward: 10, state: "pending" },
  { id: "2", title: "Do a 20 minute workout", category: "body", difficulty: "medium", xpReward: 25, state: "pending" },
  { id: "3", title: "Solve a complex coding problem", category: "mind", difficulty: "hard", xpReward: 50, state: "pending" },
  { id: "4", title: "Message 2 friends or network", category: "social", difficulty: "medium", xpReward: 25, state: "pending" },
  { id: "5", title: "Meditate for 5 minutes", category: "mind", difficulty: "easy", xpReward: 10, state: "pending" }
];
