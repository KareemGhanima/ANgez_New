import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import DashboardView from "@/components/DashboardView";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch User Stats
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!userProfile?.role) {
    redirect("/onboarding");
  }

  // Fetch all tasks for the quest feed
  // In a real app we'd fetch only uncompleted ones or generate daily.
  // For MVP, we'll fetch a list of general tasks and the user_tasks to filter.
  // We'll let the client component handle the complex logic for interactivity.
  
  const { data: tasks } = await supabase.from("tasks").select("*").limit(10);
  const { data: userTasks } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("date", new Date().toISOString().split('T')[0]); // Today's tasks

  return (
    <DashboardView 
      initialProfile={userProfile} 
      allTasks={tasks || []} 
      userTasks={userTasks || []} 
      userId={session.user.id}
    />
  );
}
