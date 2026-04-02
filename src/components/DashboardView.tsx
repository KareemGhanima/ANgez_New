"use client";

import { useState } from "react";
import { createClient } from "@/core/supabase/client";
import { Check, X, Clock, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardView({ initialProfile, allTasks, userTasks: initialUserTasks, userId }: any) {
  const [profile, setProfile] = useState(initialProfile);
  const [userTasks, setUserTasks] = useState(initialUserTasks);
  const [animatingXP, setAnimatingXP] = useState(false);
  const supabase = createClient();

  // Filter out any tasks that have been processed today
  const processedTaskIds = userTasks.map((t: any) => t.task_id);
  const availableTasks = allTasks.filter((t: any) => !processedTaskIds.includes(t.id)).slice(0, 5); // show up to 5

  const timeEstimates: Record<string, string> = {
    easy: "15m",
    medium: "30m",
    hard: "60m"
  };

  const handleTaskAction = async (task: any, action: string) => {
    // Optimistic UI updates
    setUserTasks([...userTasks, { task_id: task.id, status: action }]);

    if (action === "completed") {
      setAnimatingXP(true);
      setTimeout(() => setAnimatingXP(false), 1000);
      
      const newXP = profile.xp + task.xp;
      let newLevel = profile.level;
      let newStreak = profile.streak;

      // Handle level up
      if (newXP >= 100) {
        newLevel += Math.floor(newXP / 100);
        alert(`Level Up! You are now level ${newLevel}`);
      }

      // Handle streak if it's the first completed task today
      const completedToday = userTasks.some((t: any) => t.status === "completed");
      if (!completedToday) {
        newStreak += 1;
      }

      const updatedProfile = { 
        ...profile, 
        xp: newXP % 100, 
        level: newLevel,
        streak: newStreak
      };
      
      setProfile(updatedProfile);

      // Async DB Update
      await supabase.from("user_tasks").insert({
        user_id: userId,
        task_id: task.id,
        status: action
      });

      await supabase.from("users").update({
        xp: updatedProfile.xp,
        level: updatedProfile.level,
        streak: updatedProfile.streak
      }).eq("id", userId);
      
    } else {
      // Just record the action (skip, later, interested)
      await supabase.from("user_tasks").insert({
        user_id: userId,
        task_id: task.id,
        status: action
      });
    }
  };

  const isHighlyActive = profile.streak > 3;

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Top Header */}
      <header className="glass-panel rounded-none border-t-0 border-x-0 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2",
              isHighlyActive ? "border-primary bg-primary/20 text-primary" : "border-cardBorder bg-background/50 text-foreground/50",
              animatingXP && "animate-pulse"
            )}>
              {isHighlyActive ? "🔥" : "😴"}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{profile.role}</h2>
            <div className="text-xs text-foreground/60 flex items-center gap-1">
              <Zap size={12} className={isHighlyActive ? "text-warning" : "text-foreground/40"} />
              Streak: {profile.streak} Days
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-bold text-primary flex items-center justify-end gap-2">
            Level {profile.level}
            <button onClick={() => window.location.href = '/settings'} className="text-foreground/50 hover:text-foreground transition-colors ml-2" title="Settings">
              ⚙️
            </button>
          </div>
          <div className="w-32 h-2 bg-cardBorder rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${profile.xp}%` }}
            />
          </div>
          <div className="text-[10px] text-foreground/50 mt-1">{profile.xp} / 100 XP</div>
        </div>
      </header>

      {/* Main Quest Feed */}
      <main className="p-4 max-w-md mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground/90">
          Daily Quests
        </h1>

        <div className="space-y-4">
          {availableTasks.length === 0 ? (
            <div className="text-center p-8 glass-panel text-foreground/60">
              No more quests for today. Great job!
            </div>
          ) : (
            availableTasks.map((task: any) => (
              <div key={task.id} className="glass-panel p-4 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <div className="flex gap-3 text-xs mt-1 text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {timeEstimates[task.difficulty?.toLowerCase()] || "20m"}
                      </span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <Star size={12} fill="currentColor" /> +{task.xp} XP
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-cardBorder rounded text-foreground/70">
                    {task.category}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <button 
                    onClick={() => handleTaskAction(task, "completed")}
                    className="col-span-2 bg-success/20 text-success hover:bg-success hover:text-white py-2 rounded flex items-center justify-center gap-1 font-semibold transition-colors"
                  >
                    <Check size={16} /> Complete
                  </button>
                  <button 
                    onClick={() => handleTaskAction(task, "later")}
                    className="bg-cardBorder/50 hover:bg-cardBorder text-foreground/80 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Clock size={16} />
                  </button>
                  <button 
                    onClick={() => handleTaskAction(task, "skipped")}
                    className="bg-danger/10 hover:bg-danger/20 text-danger py-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <button
                    onClick={() => handleTaskAction(task, "interested")}
                    className="text-xs text-primary/70 hover:text-primary transition-colors underline-offset-2 hover:underline"
                  >
                    Interested (show more like this)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
