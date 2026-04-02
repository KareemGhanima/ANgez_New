"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserState, Quest, initialUserState, initialQuests } from "../core/mockData";
import { XP_PER_LEVEL, calculateLevel } from "../core/levels";

interface UserContextType {
  user: UserState;
  quests: Quest[];
  completeQuest: (id: string, attribute?: keyof UserState["attributes"]) => void;
  skipQuest: (id: string) => void;
  laterQuest: (id: string) => void;
  interestedQuest: (id: string) => void;
  updateUser: (updates: Partial<UserState>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(initialUserState);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("angez_user");
    const savedQuests = localStorage.getItem("angez_quests");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedQuests) setQuests(JSON.parse(savedQuests));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("angez_user", JSON.stringify(user));
  }, [user, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("angez_quests", JSON.stringify(quests));
  }, [quests, mounted]);

  const gainXP = (amount: number, attribute?: keyof UserState["attributes"]) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      const newAttributes = { ...prev.attributes };
      if (attribute) {
        newAttributes[attribute] += 1;
      }

      let avatarState = prev.avatarState;
      if (newXp > 500) avatarState = "high_activity";
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        attributes: newAttributes,
        avatarState
      };
    });
  };

  const completeQuest = (id: string, attribute?: keyof UserState["attributes"]) => {
    const quest = quests.find(q => q.id === id);
    if (quest && quest.state === "pending") {
      gainXP(quest.xpReward, attribute || quest.category);
      setQuests(prev => prev.map(q => q.id === id ? { ...q, state: "completed" } : q));
    }
  };

  const skipQuest = (id: string) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, state: "skipped", interestedScore: (q.interestedScore || 0) - 1 } : q));
  };

  const laterQuest = (id: string) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, state: "later" } : q));
  };

  const interestedQuest = (id: string) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, interestedScore: (q.interestedScore || 0) + 1 } : q));
  };

  const updateUser = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, quests, completeQuest, skipQuest, laterQuest, interestedQuest, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
